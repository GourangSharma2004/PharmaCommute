# Core Domain Models - Pharma Inventory System

## Design Principles

1. **Batch-First Design**: All inventory operations center around batches, not products
2. **Multi-Tenant**: Every entity has `tenant_id` for SaaS isolation
3. **Audit Trail**: No hard deletes, append-only history for compliance
4. **Status-Driven**: Stock status controls what operations are allowed
5. **Traceability**: Forward and backward traceability through batch genealogy

## Core Entities & Relationships

### 1. Tenant (Multi-tenancy Root)
```
Tenant
├── Users (1:N)
├── Products (1:N)
├── Batches (1:N)
├── Warehouses (1:N)
├── Suppliers (1:N)
├── Customers (1:N)
└── All other entities...
```

### 2. Product Master
```
Product
├── Batches (1:N) - All lots/batches of this product
├── QC Templates (1:N) - Standard QC tests for this product
└── Temperature Requirements (1:1) - Cold chain specs
```

### 3. Batch (Central Entity)
```
Batch
├── Product (N:1) - What product this batch represents
├── Supplier (N:1) - Who manufactured/supplied this batch
├── Inventory Movements (1:N) - All stock movements for this batch
├── QC Records (1:N) - All quality tests performed
├── Recall Events (N:M) - Any recalls involving this batch
├── Temperature Logs (1:N) - Cold chain monitoring
└── Batch Genealogy (N:M) - Parent/child batch relationships
```

### 4. Inventory Movement (Ledger Pattern)
```
InventoryMovement
├── Batch (N:1) - Which specific batch moved
├── From Warehouse (N:1) - Source location (nullable for receipts)
├── To Warehouse (N:1) - Destination location (nullable for issues)
├── Movement Type - Receipt, Issue, Transfer, Adjustment, etc.
├── Reference Document - PO, SO, Transfer Order, etc.
└── Created By User (N:1) - Who performed the movement
```

### 5. QC Record (Quality Control)
```
QCRecord
├── Batch (N:1) - Which batch was tested
├── QC Template (N:1) - Standard test procedure used
├── Test Results (1:N) - Individual parameter results
├── Overall Status - Pass, Hold, Reject
├── Performed By (N:1) - QC analyst
└── Approved By (N:1) - QA approver (nullable until approved)
```

### 6. Recall Event (Traceability)
```
RecallEvent
├── Affected Batches (N:M) - Which batches are recalled
├── Recall Impacts (1:N) - Where/who is affected
├── Initiated By (N:1) - Who started the recall
├── Recall Type - Customer complaint, QC failure, regulatory
└── Status - Initiated, In Progress, Closed
```

### 7. Audit Log (Compliance)
```
AuditLog
├── Tenant (N:1) - Which tenant's data changed
├── User (N:1) - Who made the change
├── Entity Type - Product, Batch, Movement, etc.
├── Entity ID - Specific record that changed
├── Action - CREATE, UPDATE, DELETE (soft)
├── Old Values - Previous state (JSON)
├── New Values - New state (JSON)
└── Timestamp - When the change occurred
```

## Key Relationships Diagram

```
Tenant
├── Product
│   └── Batch (batch-first design)
│       ├── InventoryMovement (ledger pattern)
│       │   ├── FromWarehouse
│       │   └── ToWarehouse
│       ├── QCRecord
│       │   └── QCTestResult
│       ├── RecallEvent (M:N)
│       │   └── RecallImpact
│       └── TemperatureLog
├── User
│   ├── InventoryMovement (created_by)
│   ├── QCRecord (performed_by, approved_by)
│   └── AuditLog (performed_by)
├── Warehouse
│   ├── InventoryMovement (from/to)
│   └── TemperatureLog
├── Supplier
│   └── Batch (sourced_from)
└── Customer
    └── RecallImpact (affected_customer)
```

## Stock Status Flow

```
QUARANTINE (default on receipt)
    ↓ (QC Pass)
AVAILABLE
    ↓ (Issue/Reserve)
RESERVED
    ↓ (Dispatch)
ISSUED

BLOCKED ← (QC Reject, Recall, Damage)
EXPIRED ← (Past expiry date)
```

## Batch Genealogy (Traceability)

```
Raw Material Batch A ─┐
Raw Material Batch B ─┼─→ Finished Goods Batch X
Raw Material Batch C ─┘

Finished Goods Batch X ─┐
                        ├─→ Repacked Batch Y
                        └─→ Repacked Batch Z
```

## Audit Strategy

Every business operation creates:
1. **Primary Record** (Batch, Movement, QC, etc.)
2. **Audit Log Entry** (Who, What, When, Old/New values)
3. **Event** (for downstream systems like AI, alerts)

No record is ever truly deleted - only marked as `deleted_at` with audit trail.
