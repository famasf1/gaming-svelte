# Svelte 5 Runes - Your Project as Context

## TL;DR for .NET Devs

| .NET Concept                        | Svelte 5 Equivalent             |
| ----------------------------------- | ------------------------------- |
| `Control.Text = "x"`                | `value = "x"` (auto-updates UI) |
| `public string Title { get; set; }` | `let title = $state("")`        |
| Constructor parameters              | `$props()`                      |
| INotifyPropertyChanged              | Built into `$state`             |
| Data Binding (two-way)              | `$bindable()`                   |
| Computed property                   | `$derived()`                    |
| `Form_Load` / `PropertyChanged`     | `$effect()`                     |

---

## 1. `$props()` - Receiving Data from Parent

**Your project: `src/lib/components/ui/button/button.svelte`**

```svelte
<script lang="ts">
    type Variant = 'default' | 'destructive' | 'outline' | ...;
    type Size = 'default' | 'sm' | 'lg' | 'icon';

    interface Props extends HTMLButtonAttributes {
        variant?: Variant;      // Optional - has default
        size?: Size;            // Optional - has default
    }

    let {
        variant = 'default',    // Default value
        size = 'default',
        class: className,        // Special: maps to CSS class
        children,                // Special: content passed inside <Button>...</Button>
        ...props                // All other HTML attributes (type, disabled, onclick, etc.)
    }: Props = $props();
</script>

<button class="..." {...props}>
	{@render children?.()}
	<!-- Render whatever was passed inside -->
</button>
```

**Usage in parent:**

```svelte
<Button variant="destructive" size="sm" onclick={handleClick}>Delete</Button>
```

**.NET equivalent:**

```csharp
public class MyButton : Button
{
    [DefaultValue("default")]
    public Variant Variant { get; set; } = "default";

    [DefaultValue("sm")]
    public Size Size { get; set; } = "sm";
}
```

### Key points:

- `$props()` is like **constructor parameters**
- `class` is reserved - use `class: className` to avoid conflict
- `children` is special - it captures content between opening/closing tags
- `...props` forwards remaining HTML attributes (onclick, type, disabled, etc.)

---

## 2. `$state()` - Reactive Variables

**Your project: `src/routes/admin/articles/[id]/+page.svelte`**

```svelte
<script lang="ts">
	let { data } = $props(); // Data from server (+page.ts)

	// Form fields - user will edit these
	let title = $state(data.article?.title ?? '');
	let saving = $state(false);
	let showTrashDialog = $state(false);

	// User changes title
	function handleInput(e) {
		title = e.target.value; // This triggers UI update automatically
	}
</script>

<input value={title} oninput={handleInput} />
{#if saving}
	<p>Saving...</p>
{/if}
```

**.NET equivalent:**

```csharp
private string _title = "";
public string Title
{
    get => _title;
    set { _title = value; OnPropertyChanged("Title"); }  // Manual notification
}
```

### The Critical Gotcha (Why The Warning?)

```svelte
// ❌ WRONG - only captures initial value let title = $state(data.article?.title ?? ''); // ✅ RIGHT
if user edits it (form field) let title = $state(data.article?.title ?? ''); // ✅ RIGHT if you want
it to always reflect data let title = $derived(data.article?.title ?? '');
```

---

## 3. `$derived()` - Computed Values with Auto-Reactivity

**Your project: `src/routes/admin/articles/+page.svelte`**

```svelte
<script lang="ts">
	import { page } from '$app/state';

	let { data } = $props();

	// Derives from URL - always stays in sync
	const filter = $derived(page.url.searchParams.get('filter') || 'all');
</script>

<a href="/admin/articles?filter=published" class:bg-primary={filter === 'published'}> Published </a>
```

### The Key Difference from Regular Ternary/Getter

```svelte
<script>
	let count = $state(0);

	// ❌ Regular - runs ONCE, never updates
	function double() {
		return count * 2;
	}

	// ✅ $derived - re-runs when count changes
	let double = $derived(count * 2);
</script>

<button onclick={() => count++}>Increment</button>
<p>Double: {double}</p>
<!-- Updates automatically with $derived, NOT with function -->
```

### .NET Comparison

```csharp
// Regular method - must call manually each time
public int Double() => Count * 2;

// Calculated property - still must access after Count changes
public int Double => Count * 2;

// $derived is like: automatic recalculation + cache invalidation
```

### Summary: `$derived` vs Regular Getter

| Syntax                         | Re-runs when deps change? |
| ------------------------------ | ------------------------- |
| `let x = expr`                 | No - one-time             |
| `function x() { return expr }` | No - must call manually   |
| `let x = $derived(expr)`       | Yes - automatically       |

### When to use `$derived`:

- Always matches something else (URL params, other state, props)
- Read-only (no assignment)
- Computed from other reactive values

---

## 4. `$bindable()` - Parent ↔ Child Two-Way Binding

**Your project: `src/lib/components/ui/switch/switch.svelte`**

```svelte
<script lang="ts">
	let {
		class: className,
		checked = $bindable(false), // ← Can be bound from parent
		...props
	}: Props = $props();
</script>

<input type="checkbox" bind:checked {...props} />
```

### What `$bindable` Actually Does

```svelte
<!-- Parent.svelte -->
<script>
	let isPublished = $state(false); // Parent's state
</script>

<!-- Child can now update parent's state! -->
<Switch bind:checked={isPublished} />
<p>Published: {isPublished}</p>
```

| Action                           | Result                                   |
| -------------------------------- | ---------------------------------------- |
| User clicks checkbox in child    | Parent's `isPublished` updates to `true` |
| Parent sets `isPublished = true` | Checkbox in child checks automatically   |

### Without `$bindable` - One-Way Only

```svelte
<!-- Only goes parent → child -->
<Switch checked={isPublished} />

<!-- Child changes don't propagate back to parent -->
<Switch checked={isPublished} onchange={(v) => (isPublished = v)} />
```

### .NET Analogy

```csharp
// In WinForms, controls had two-way binding built-in
textBox1.DataBindings.Add("Text", bindingSource, "PropertyName");

// $bindable does the same - parent state and child prop stay in sync
// regardless of which side changes
```

---

## 5. `$effect()` - Side Effects (Like PropertyChanged)

**Your project: `src/routes/admin/+layout.svelte`**

```svelte
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { children, data } = $props();

	// Runs when data.session or page.url changes
	$effect(() => {
		if (!data.session && page.url.pathname !== '/admin/login') {
			goto('/admin/login');
		}
	});
</script>
```

**Use cases:**

- Navigation guards (like this example)
- Logging / analytics
- Syncing external state (localStorage, WebSocket)
- Triggering actions when values change

**.NET equivalent:**

```csharp
public class MyForm : Form
{
    protected override void OnPropertyChanged(PropertyChangedEventArgs e)
    {
        base.OnPropertyChanged(e);
        if (e.PropertyName == "Session" && Session == null)
            NavigateToLogin();
    }
}
```

### Comparison Table

| Scenario               | Svelte 5      | .NET                               |
| ---------------------- | ------------- | ---------------------------------- |
| Store value user edits | `$state()`    | `public string Prop { get; set; }` |
| Read-only computed     | `$derived()`  | `public string Computed => ...`    |
| Parent passes in       | `$props()`    | Constructor / Property             |
| Two-way binding        | `$bindable()` | DataBindings                       |
| Watch for changes      | `$effect()`   | PropertyChanged event              |

---

## 6. `{@render children()}` - Replacing `<slot />`

**Old (Svelte 4):**

```svelte
<div><slot /></div>
```

**New (Svelte 5):**

```svelte
<script lang="ts">
	let { children, ...props } = $props();
</script>

<div>{@render children?.()}</div>
```

**Your project: `src/lib/components/ui/button/button.svelte`**

```svelte
<button {...props}>
	{@render children?.()}
</button>
```

The `?.()` handles the case when no children are passed (null-safe).

---

## Quick Reference - Your Project Examples

| File                    | Pattern                             | What It Does                      |
| ----------------------- | ----------------------------------- | --------------------------------- |
| `button.svelte`         | `$props()` + `{@render children()}` | Reusable button with variant/size |
| `switch.svelte`         | `$bindable()`                       | Two-way bound toggle              |
| `input.svelte`          | `$bindable()`                       | Two-way bound text input          |
| `articles/+page.svelte` | `$derived()`                        | Derives filter from URL           |
| `[id]/+page.svelte`     | `$state()`                          | Form fields user edits            |
| `admin/+layout.svelte`  | `$effect()`                         | Auth redirect guard               |
| `trash-dialog.svelte`   | `$bindable()`                       | Dialog open/close state           |
