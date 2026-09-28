# Risk Rubric

Risk = Likelihood of failure x Impact of failure

Each axis scored 1-3, increasing scale

## Sample Criteria

NOTE: These criteria are context dependent.

### Likelihood of Failure

1. Surface area: number of endpoints and operations
2. Logic complexity
3. Input complexity
4. Dependencies
5. Change rate

**Scores**

- 1: a few simple read operations with little logic.
- 2: full CRUD, or moderate validation rules.
- 3: multi-step flows, calculations, or dependencies on other parts of the system.

### Impact of failure

1. Financial loss to company
2. Compromising sensitive data, admin functions
3. Prevents intended use of other features besides itself
4. Number of impacted users

**Scores:**

- 1: cosmetic, a workaround exists, or few users are affected.
- 2: one feature broken for many users, or wrong data that doesn't involve money.
- 3: incorrect prices, exposed sensitive data, or a blocked core flow.
