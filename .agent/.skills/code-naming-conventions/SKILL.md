---
name: code-naming-conventions
description: Defines mandatory naming conventions for variables, functions, parameters, properties, state, events, observables, services, models, DTOs, and feature code in Botaleb Assistant so names communicate business meaning, responsibility, data shape, ownership, lifecycle, and intent.
disable-model-invocation: false
---

# Code Naming Conventions

## Purpose

Names are part of the code contract.

Use names that communicate meaning, responsibility, and intent without requiring the reader or agent to inspect the implementation first.

The goal is semantic clarity, not shorter names.

---

# Core Rule

Before creating or renaming a variable, function, parameter, property, event, service, model, or component, ask:

- What does it represent?
- What business concept does it represent?
- What responsibility does it have?
- What data shape does it hold or return?
- What state does it represent?
- Who owns it?
- What is its lifecycle?
- What direction does data or control move?

Prefer explicit domain names over generic names.

---

# Execution Role

Naming is a **cross-cutting constraint**, not a final cleanup stage. Apply it when code is created or modified.

Do not schedule a separate naming phase after implementation. If a name is unclear because responsibility is unclear, resolve the responsibility first instead of inventing a generic name.

```text
Domain meaning  → domain-invariants
State ownership → state-and-data-flow
Architecture    → architecture-guardian
Naming          → this skill
```

# Variables

Use a singular domain noun for one entity:

```ts
student
order
selectedStudent
currentOrder
```

Use plural nouns for collections:

```ts
students
orders
products
selectedProducts
availableOptions
```

Avoid generic names when the real meaning is known:

```ts
data
result
item
obj
temp
tempData
thing
value
```

Generic names are acceptable only when the local scope makes the meaning genuinely obvious.

---

# Booleans

Boolean names must communicate a state, capability, or condition.

Prefer:

```ts
isLoading
isSubmitting
isEditing
isModalOpen
hasSelection
hasError
canEdit
canDelete
shouldRefresh
```

Avoid ambiguous boolean names such as:

```ts
loading
editing
selection
error
active
```

when the boolean nature and meaning can be made explicit.

---

# State

State names must describe the state they represent and should expose ownership clearly.

Prefer:

```ts
selectedStudent
activeConversation
currentPage
searchTerm
selectedProductType
isModalOpen
isSubmitting
```

Avoid:

```ts
state
current
selected
value
```

when the business meaning is known.

Do not rename state merely to make it shorter if the existing name already communicates the correct concept.

---

# Functions

Function names must describe an action and normally start with a verb.

Prefer:

```ts
loadStudents()
searchStudents()
createOrder()
updateProduct()
deleteMessage()
openStudentModal()
closeStudentModal()
selectStudent()
submitOrder()
resetForm()
```

Avoid vague names:

```ts
process()
execute()
run()
handle()
doSomething()
processData()
handleData()
```

Use `handle...` or `on...` for event handlers when that matches the repository convention, and make the event explicit.

```ts
handleStudentSelected()
onPageChanged()
onSearchChanged()
```

Do not mix naming conventions arbitrarily within the same feature.

---

# Parameters

Parameter names must describe the semantic meaning of the argument.

Prefer:

```ts
studentId
orderId
productId
student
order
filters
searchTerm
pageNumber
pageSize
selectedProduct
formValue
request
```

Avoid:

```ts
id
data
obj
value
item
param
input
x
```

when a more meaningful name is known.

When multiple parameters have the same primitive type, semantic names are mandatory.

Prefer:

```ts
createOrder(studentId, productId, quantity)
```

over:

```ts
createOrder(id, id2, value)
```

Avoid positional boolean parameters whose meaning is unclear at the call site.

Prefer an options object when several flags are required:

```ts
updateStudent(student, {
  isDraft: true,
  notifyUser: false,
})
```

---

# Parameter Objects

Use a parameter object when several related arguments make a function call difficult to understand or likely to evolve.

```ts
loadStudents({
  searchTerm,
  pageNumber,
  pageSize,
  sortField,
})
```

Do not introduce a parameter object only for abstraction's sake.

---

# Events

Output/event names should describe the business interaction or what happened, not the implementation mechanism.

Prefer:

```ts
studentSelected
editRequested
deleteRequested
submitted
closed
cancelled
```

Avoid:

```ts
clickEvent
buttonClicked
dataChanged
event
action
```

when the actual interaction is known.

Event handlers should use the established repository convention:

```ts
onStudentSelected()
```

or:

```ts
handleStudentSelected()
```

---

# Observables

If the repository uses the `$` convention, Observable variables must use it consistently:

```ts
students$
orders$
loading$
selectedStudent$
```

Do not mix Observable and non-Observable naming conventions in the same feature.

---

# Services

Service names must communicate responsibility.

Prefer:

```ts
StudentService
OrderService
StudentLookupService
FileUploadService
AuthenticationService
```

Avoid vague names such as:

```ts
HelperService
CommonService
UtilityService
ManagerService
```

unless the abstraction genuinely owns that generic responsibility.

---

# Components

Component names should communicate UI responsibility.

Prefer:

```text
StudentListComponent
StudentFormComponent
StudentDetailsComponent
OrderTableComponent
```

Avoid:

```text
DataComponent
MainComponent
CommonComponent
Component1
ManagerComponent
```

Do not encode feature-specific business logic into names of shared components.

---

# Models, DTOs, and Contracts

Use domain nouns for models:

```ts
Student
Order
Product
Conversation
Message
```

Use suffixes only when they communicate a real contract or role:

```ts
StudentDto
StudentResponse
CreateStudentRequest
UpdateStudentRequest
StudentFilter
StudentQuery
```

Preserve backend naming in transport DTOs when required by the API contract. Perform explicit mapping at the appropriate boundary when feature/domain naming differs.

Prefer directional mapping names:

```ts
mapStudentDtoToModel()
mapStudentModelToDto()
mapFormValueToStudentDto()
mapStudentToFormValue()
```

Avoid vague transformation names such as:

```ts
convert()
transform()
mapData()
prepareData()
```

when the direction and domain are known.

---

# Forms and Configuration

Form names should identify the business object:

```ts
studentForm
orderForm
productForm
```

Form controls should use the actual business field:

```ts
firstName
lastName
phoneNumber
email
quantity
price
```

Feature-specific configuration should communicate what it configures:

```ts
studentColumns
studentActions
orderColumns
filterOptions
modalConfig
```

Avoid bare names such as `form`, `config`, `options`, or `settings` when the scope contains multiple concepts.

---

# Generic Shared Components

Shared components must remain generic in naming and responsibility.

For example, a GenericTable should receive feature-specific semantic configuration from the feature:

```ts
studentColumns
studentActions
```

rather than embedding student-specific meaning in the shared component.

---

# Repository Convention Has Priority

Before introducing a new naming style, inspect nearby code and existing conventions.

Follow the established repository convention unless it conflicts with a clear correctness or maintainability problem.

Do not perform broad naming refactors unrelated to the task.

---

# Naming Validation

During implementation, inspect every newly introduced or materially changed:

- variable
- function
- parameter
- property
- state field
- event/input/output
- Observable
- service
- component
- model
- DTO
- form/control
- configuration object

Reject names that are ambiguous when the real meaning is known.

A name is good when a developer can infer its meaning, responsibility, and role from the name and local context without opening its implementation.

---

# Engineering Concepts

This skill applies:

- Semantic Naming
- Self-Documenting Code
- Domain-Driven Design / Ubiquitous Language
- Cognitive Load Reduction
- Separation of Concerns through responsibility-revealing names

Naming is not a cosmetic concern. Ambiguous names increase the reasoning required to understand, modify, and validate a system.
