### **Task 1: High-Performance Hotel Transaction Dashboard**

**Objective:**  
Build a scalable reporting system for hotel transactions.

**Database Structure:**

- `transactions` (id, hotel_id, amount, status, created_at)
- `hotels` (id, name, company_type, business_type)

**Requirements:**

Develop an API endpoint:  
GET /api/dashboard/summary

-
- Implement filters:
  - Date range
  - Company type
  - Business type

**Response should include:**

- Total revenue
- Total transactions
- Revenue grouped by status
- Top 5 hotels based on revenue

**Technical Expectations:**

- Efficient use of PostgreSQL aggregation (`GROUP BY`)
- Proper indexing strategy
- Avoid N+1 query issues
- Query performance analysis using `EXPLAIN ANALYZE`

**Bonus:**

- Implement a materialized view for performance optimization

---

### **Task 2: Real-Time Notification System**

**Objective:**  
Notify the system when a transaction fails.

**Requirements:**

- Use Queue system
- Create an event: `TransactionFailed`
- Listener should:
  - Log the failure
  - Broadcast notification via WebSocket

**Technical Stack:**

- Redis (queue management)
- WebSocket

**Additional Requirements:**

- Retry failed jobs
- Dead-letter queue handling

Monitoring endpoint:  
GET /api/queue/status

- ***

### **Task 3: PostgreSQL Query Optimization**

**Given Query:**

SELECT [h.name](http://h.name/), SUM(t.amount)

FROM transactions t

JOIN hotels h ON [h.id](http://h.id/) \= t.hotel_id

WHERE t.status \= 'success'

AND t.created_at BETWEEN '2025-01-01' AND '2025-12-31'

GROUP BY [h.name](http://h.name/);

**Tasks:**

- Optimize the query for performance
- Suggest and implement appropriate indexes
- Explain improvements and cost reduction

**Expected Concepts:**

- Composite indexes
- Partial indexes (PostgreSQL-specific)

---

### **Task 4: Dynamic Form Builder**

**Objective:**  
Create a system where admins can define dynamic forms.

**Backend Requirements:**

- Store form schema using PostgreSQL `JSONB`

APIs:  
POST /api/forms

GET /api/forms/{id}

POST /api/forms/{id}/submit

- **Frontend Requirements:**

- Render dynamic forms
- Apply validation from schema
- Support nested fields

---

### **Task 5: API Rate Limiting & Security**

**Requirements:**

- Implement:
  - IP-based rate limiting
  - User-based rate limiting

**Advanced:**

- Custom middleware to detect abnormal traffic patterns
- Temporary blocking mechanism

---

### **Task 6: File Upload & Processing Pipeline**

**Objective:**  
Handle large CSV uploads efficiently.

**Requirements:**

- Upload CSV file (\~100k rows)
- Process asynchronously using Queue

**Technical Expectations:**

- Chunked processing
- Database transactions
- Memory-efficient implementation

---

### **Task 7: Full-Text Search (PostgreSQL)**

**Objective:**  
Implement efficient search functionality for hotels.

**Requirements:**

- Use PostgreSQL full-text search:
  - `tsvector`
  - `GIN index`

**API Example:**

GET /api/search?q=hotel

---

### **Submission Guidelines**

- Provide source code via Git repository
- Include setup instructions (README)
- Mention any assumptions made
- Highlight performance optimizations

---

### **Evaluation Criteria**

We will evaluate your submission based on:

- Code quality and structure
- Performance optimization
- Database design and efficiency
- Problem-solving approach
- Scalability considerations
