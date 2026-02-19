# Switching to Rust: Pros and Cons Report

## UC Benefits Calculator (entitledto)

**Date:** 17 February 2026
**Current Stack:** TypeScript 5.9 / React 19 / Vite 7 / TanStack Router / Tailwind CSS 4

---

## 1. Executive Summary

This report evaluates the feasibility and trade-offs of migrating the UC Benefits Calculator from its current TypeScript/React stack to Rust. The application is a client-side single-page application (SPA) with ~65+ component files, ~7,300 lines of business logic, an 11-page form wizard, and no backend API. Rust could be used either as a full frontend rewrite (via WebAssembly frameworks like Leptos, Yew, or Dioxus) or as a partial migration targeting the calculation engine only.

**Recommendation:** A full rewrite to Rust is not advisable for this project. A partial migration, compiling the calculation engine to WebAssembly, could offer modest benefits but is unlikely to justify the effort given the application's current profile.

---

## 2. Current Application Profile

| Attribute | Detail |
|-----------|--------|
| **Language** | TypeScript 5.9.3 |
| **UI Framework** | React 19.2.0 |
| **Build Tool** | Vite 7.1.11 |
| **Routing** | TanStack Router (file-based) |
| **Forms** | TanStack React Form + Informed |
| **Styling** | Tailwind CSS 4.1.15 |
| **Validation** | Zod 4.1.12 |
| **Testing** | Vitest 4.0.8 + Testing Library |
| **PDF Export** | jsPDF + html2canvas |
| **External APIs** | None (fully client-side) |
| **Data Storage** | Browser LocalStorage |
| **Codebase Size** | ~65+ files, ~7,300 LOC business logic |
| **Calculation Engine** | ~1,088 LOC (`calculator.ts`) |
| **Test Coverage** | 5 test suites (limited) |

---

## 3. Rust Frontend Options

If migrating to Rust, the most mature frontend frameworks compiled to WebAssembly (Wasm) are:

| Framework | Maturity | Approach | Comparable To |
|-----------|----------|----------|---------------|
| **Leptos** | Most active, growing | Fine-grained reactivity, SSR support | SolidJS |
| **Yew** | Most established | Component-based, virtual DOM | React |
| **Dioxus** | Cross-platform focus | RSX syntax, desktop/mobile/web | React Native |
| **Sycamore** | Smaller community | Fine-grained reactivity | SolidJS |

---

## 4. Pros of Switching to Rust

### 4.1 Performance & Correctness

**Type Safety Beyond TypeScript**
Rust's type system is stricter than TypeScript's. TypeScript allows `any`, implicit type coercion, and runtime type mismatches that compile cleanly. Rust enforces correctness at compile time with no escape hatches in safe code. For a benefits calculator where incorrect results could mislead vulnerable claimants, this is meaningful.

- Rust's `enum` with pattern matching ensures every case is handled (no forgotten benefit types)
- No `null` or `undefined` -- `Option<T>` forces explicit handling of missing values
- No runtime type errors -- if it compiles, the type contracts are honoured

**Computational Performance**
WebAssembly compiled from Rust runs at near-native speed. The calculation engine (~1,088 LOC) performs arithmetic across multiple benefit elements, tax bands, NI thresholds, and taper rates. In Rust/Wasm this would execute faster.

- However, the current calculations complete in under 1ms in JavaScript -- there is no observable performance problem to solve
- The bottleneck, if any, is DOM rendering, not arithmetic

**Memory Safety**
Rust's ownership model eliminates entire categories of bugs (use-after-free, data races, buffer overflows). While these are rarely issues in a browser SPA, the guarantees are still valuable for long-running sessions where memory leaks from React state mismanagement could accumulate.

### 4.2 Long-Term Maintainability

**Compiler-Driven Refactoring**
When benefit rates change annually (the calculator already supports 2023/24 through 2026/27), Rust's compiler catches every location that needs updating. TypeScript's compiler does this partially, but Rust's exhaustive pattern matching and lack of `any` makes it more reliable.

**No Runtime Surprises**
JavaScript's loose equality, implicit coercion, and floating-point quirks can produce subtle bugs in financial calculations. Rust makes these impossible:
- No `0.1 + 0.2 !== 0.3` surprises if using fixed-point decimal libraries
- No `"5" + 3 === "53"` string coercion
- No `NaN` propagating silently through calculations

### 4.3 WebAssembly as a Distribution Format

**Portability**
A Rust/Wasm calculation engine could be embedded in other contexts beyond the browser: desktop apps, server-side validation, other organisations' systems, or even embedded devices used by advisors.

**Tamper Resistance**
Wasm binaries are harder to inspect and modify than JavaScript bundles. For a calculator that could influence benefit claims, this provides a modest layer of integrity protection.

---

## 5. Cons of Switching to Rust

### 5.1 Ecosystem Immaturity (Critical)

**UI Component Libraries**
The React ecosystem offers thousands of battle-tested UI components. Rust/Wasm frameworks have a fraction of this:

| Need | React/TS Ecosystem | Rust/Wasm Ecosystem |
|------|-------------------|---------------------|
| Form libraries | TanStack Form, React Hook Form, Formik, Informed | Limited; mostly hand-rolled |
| Routing | TanStack Router, React Router (mature, file-based) | Basic routing in Leptos/Yew; no TanStack equivalent |
| PDF generation | jsPDF, react-pdf, pdfmake | Must call JS via wasm-bindgen interop |
| Styling | Tailwind, styled-components, CSS modules | Tailwind works but tooling is limited |
| Form validation | Zod, Yup, Joi | No equivalent; must implement manually or use serde |
| Testing | Vitest, Jest, Testing Library, Cypress | wasm-bindgen-test (basic); no Testing Library equivalent |
| Dev tools | React DevTools, Vite HMR, browser extensions | Limited; no equivalent to React DevTools |

The application relies heavily on TanStack Router, TanStack Form, Informed, Zod, jsPDF, and html2canvas. None of these have Rust equivalents. Every one would need to be replaced or interfaced with via JavaScript interop, negating much of the benefit.

**Community & Hiring**
- React/TypeScript developers are abundant; Rust frontend developers are rare
- Stack Overflow, tutorials, and blog posts for Rust/Wasm frontend are sparse compared to React
- Debugging Wasm in the browser is significantly harder than debugging JavaScript

### 5.2 Development Velocity (Critical)

**Rewrite Cost**
The application has ~65+ component files and ~7,300 lines of business logic. A full rewrite would require:

- Reimplementing 11 form pages with complex conditional visibility
- Reimplementing the multi-step workflow system (context, navigation, progress tracking)
- Reimplementing all calculation utilities
- Reimplementing PDF export, scenario storage, and comparison features
- Reimplementing all shared UI components (accordion, alerts, buttons, form fields)
- Building or finding replacements for every npm dependency

Conservative estimate: 3-6 months of full-time work for an experienced Rust developer, compared to the existing working application.

**Iteration Speed**
- Rust compile times are significantly longer than TypeScript/Vite's near-instant HMR
- A typical Rust/Wasm build cycle: 10-30 seconds for incremental builds vs <1 second with Vite
- Benefit rate changes and policy updates need to ship quickly; slower iteration is a real cost
- The Rust borrow checker, while valuable, adds friction to rapid UI prototyping

**Form-Heavy Applications Are Rust's Weakest Area**
This application is primarily a complex multi-step form. Forms require:
- Two-way data binding
- Conditional field visibility
- Validation with user-friendly error messages
- Dynamic field arrays (e.g., multiple children)
- Complex state interdependencies (e.g., partner earnings visibility depends on relationship status)

React/TypeScript excels at this. Rust/Wasm frameworks handle it, but with considerably more boilerplate and less tooling support.

### 5.3 Bundle Size

**Wasm Baseline Overhead**
A minimal Rust/Wasm application starts at ~200-400KB for the Wasm binary alone. The current Vite/React bundle, with tree-shaking, is likely comparable or smaller. For a calculator that should load quickly on low-bandwidth connections (relevant for UC claimants who may have limited data plans), this matters.

### 5.4 Accessibility & SEO

**Screen Reader Compatibility**
React's accessibility story is mature, with ARIA attribute support, focus management libraries, and extensive testing tools. Rust/Wasm frameworks have less mature accessibility support. For a government-adjacent benefits calculator, WCAG compliance is likely a requirement.

**Server-Side Rendering**
Leptos supports SSR, but the tooling is less mature than Next.js or Remix. If SSR becomes a requirement, the React ecosystem is better positioned.

### 5.5 Interoperability Friction

**JavaScript Interop Tax**
Features that rely on browser APIs or JavaScript libraries (LocalStorage, PDF generation, html2canvas, clipboard API) require `wasm-bindgen` interop. This adds:
- Serialisation/deserialisation overhead at the Wasm/JS boundary
- Additional boilerplate code
- Debugging complexity when errors cross the boundary

The application currently uses LocalStorage extensively for scenario storage, jsPDF + html2canvas for PDF export, and browser APIs for various features. Each of these would require interop wrappers.

---

## 6. Partial Migration: Calculation Engine Only

A middle-ground approach would compile only the calculation engine (`calculator.ts`, ~1,088 LOC) to Rust/Wasm while keeping the React frontend.

### Pros
- Type-safe, compiler-verified calculations
- Portable calculation module (reusable outside the browser)
- No UI rewrite needed
- Can be done incrementally

### Cons
- Adds build complexity (Rust toolchain + wasm-pack alongside Vite)
- Serialisation overhead at the JS/Wasm boundary for every calculation
- Two languages in one project increases maintenance burden
- The calculation already runs in <1ms -- no user-visible performance gain
- Developers must know both TypeScript and Rust
- Testing must span both ecosystems

### Verdict
Technically feasible but the cost-benefit ratio is poor. The calculation engine is not a performance bottleneck, and TypeScript already provides adequate type safety for arithmetic operations if used properly. The effort would be better spent improving test coverage for the existing TypeScript calculator.

---

## 7. Alternative Improvements (Without Rust)

Instead of a Rust migration, the following would address the legitimate concerns that motivate a Rust switch:

| Concern | Rust Solution | TypeScript Solution |
|---------|--------------|-------------------|
| Type safety | Rust's strict types | Enable stricter `tsconfig` rules; eliminate all `any`; use branded types for currency amounts |
| Calculation correctness | Rust's exhaustive matching | Add comprehensive unit tests (currently only 5 test suites); use `ts-pattern` for exhaustive matching |
| Financial precision | Rust's decimal libraries | Use a library like `decimal.js` or `big.js`; or work in pence (integers) throughout |
| Memory safety | Rust ownership model | Use React 19's compiler for automatic memoisation; profile with Chrome DevTools |
| Code quality | Rust compiler enforcement | Add ESLint strict rules; enable `noUncheckedIndexedAccess`; add Zod validation at data boundaries |
| Portability | Wasm binary | Extract calculation logic into a standalone npm package |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Rewrite takes longer than expected | High | High | Incremental migration; keep React frontend |
| Cannot hire Rust frontend developers | High | High | Train existing team; accept slower development |
| Rust/Wasm framework becomes unmaintained | Medium | High | Choose Leptos (most active); have fallback plan |
| Accessibility compliance gaps | Medium | High | Extensive WCAG testing before launch |
| Performance regression (bundle size) | Medium | Low | Lazy-load Wasm modules; code splitting |
| Policy changes blocked by slow iteration | Medium | High | Maintain parallel TypeScript version during transition |

---

## 9. Conclusion

### The case against switching

This application is a **form-heavy, client-side SPA** with **no performance bottleneck**, **no backend**, and **heavy reliance on the React/npm ecosystem**. It is precisely the type of application where TypeScript/React excels and where Rust/Wasm adds friction without proportionate benefit. The rewrite cost is high, the ecosystem support is immature, and the problems Rust solves (memory safety, performance, concurrency) are not problems this application has.

### When Rust would make sense

Rust would be a strong choice if:
- The calculation engine were computationally intensive (e.g., Monte Carlo simulations, large dataset processing)
- There were a server-side component processing thousands of calculations per second
- The calculation logic needed to run in multiple environments (embedded, server, browser, mobile)
- The application had strict security requirements around data processing integrity
- The team already had Rust expertise

### Recommendation

**Do not migrate to Rust.** Instead, invest in:

1. **Comprehensive test coverage** for the calculation engine (highest impact, lowest cost)
2. **Stricter TypeScript configuration** to close type safety gaps
3. **Integer arithmetic** (pence, not pounds) to eliminate floating-point issues
4. **Extract the calculator as a standalone, well-tested module** for potential reuse
5. **Address the existing limited test coverage** (5 test suites for ~7,300 LOC of business logic)

These improvements would deliver the correctness benefits that motivate a Rust migration at a fraction of the cost and risk.
