<!-- user\docs\erd.md -->

# User Service: Entities & Relationship

* **user**

  * Stores basic user info (username, email, password, etc.)

* **USER\_PROFILE**

  * Stores extra info for a user (bio, location, birthdate, etc.)

**Relationship:**
Each user can have one profile.
Each profile belongs to one user.
*(One-to-one)*

---

> **Naming note**:  
> Field names in this ERD are shown in `snake_case` for readability.  
> The corresponding Prisma models use `camelCase` — refer to the Prisma schema for exact field names.
