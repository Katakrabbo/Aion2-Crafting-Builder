"use strict";
const $ = (id) => document.getElementById(id);
const initialRecipes = [
    {
        id: "truth",
        out: "Splendent Truth Orb",
        yield: 1,
        attempts: 1,
        ingredients: [
            ["Magic Crystal", 3],
            ["Refining Stone", 5],
            ["Odyle", 2],
        ],
    },
    {
        id: "expert",
        out: "Expert's Splendent Truth Orb",
        yield: 1,
        attempts: 1,
        ingredients: [
            ["Splendent Truth Orb", 1],
            ["Expert's Refining Stone", 5],
            ["Fine Sapphire Gemstone", 6],
            ["Fine Odyle", 3],
        ],
    },
    {
        id: "artisan",
        out: "Artisan's Splendent Truth Orb",
        yield: 1,
        attempts: 1,
        ingredients: [
            ["Expert's Splendent Truth Orb", 1],
            ["Artisan's Refining Stone", 5],
            ["Pure Sapphire Gemstone", 8],
            ["Pure Odyle", 4],
        ],
    },
    {
        id: "dragon",
        out: "Star Dragon Lord Orb",
        yield: 1,
        attempts: 1,
        ingredients: [
            ["Artisan's Splendent Truth Orb", 1],
            ["Artisan's Ultimate Refining Stone", 4],
            ["Enhanced Thick Balaur Scale", 22],
            ["Wrathful Mind", 10],
            ["Radiant Sapphire Gemstone", 9],
            ["Radiant Odyle", 5],
        ],
    },
    {
        id: "magic",
        out: "Magic Crystal",
        yield: 1,
        attempts: 1,
        ingredients: [
            ["Spiritstone", 2],
            ["Catalyst (Bound)", 1],
        ],
    },
    {
        id: "scale",
        out: "Enhanced Thick Balaur Scale",
        yield: 1,
        attempts: 1,
        ingredients: [
            ["Balaur's Essence", 2],
            ["Lesser Dragon Scale Hardener (Bound)", 1],
        ],
    },
];
const newId = () => "id" + Math.random().toString(36).slice(2, 11);
const base = () => ({
    recipes: structuredClone(initialRecipes),
    projects: [
        {
            id: "p1",
            name: "Star Dragon Lord",
            goal: "Star Dragon Lord Orb",
            qty: 1,
        },
    ],
    active: "p1",
    stock: {},
    prices: {},
});
let db;
try {
    db = JSON.parse(localStorage.getItem("aion2_universal_fixed_v1")) || base();
    if (
        !Array.isArray(db.recipes) ||
        !Array.isArray(db.projects) ||
        !db.projects.length
    )
        db = base();
} catch (e) {
    db = base();
}
function save() {
    try {
        localStorage.setItem("aion2_universal_fixed_v1", JSON.stringify(db));
    } catch (e) { }
}
function project() {
    return db.projects.find((p) => p.id === db.active) || db.projects[0];
}
function number(x, def = 0) {
    let n = Number(x);
    return Number.isFinite(n) ? Math.max(0, n) : def;
}
function fmt(n) {
    return Number(n).toLocaleString("it-IT", { maximumFractionDigits: 2 });
}
function node(tag, content, attrs = {}) {
    const e = document.createElement(tag);
    if (content !== null) e.textContent = String(content);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}
function fillSelect(el, options, value) {
    el.replaceChildren(
        ...options.map(([v, t]) => node("option", t, { value: v }))
    );
    el.value = value;
}
function recipesFor(name) {
    return db.recipes.find((r) => r.out === name);
}
function calculate() {
    const demand = {},
        remaining = { ...db.stock },
        warnings = [],
        crafted = {};
    let calls = 0;
    function consume(name, qty, stack = []) {
        if (++calls > 100000) {
            warnings.push("Calculation limit reached.");
            return;
        }
        if (qty <= 0) return;
        if (stack.includes(name)) {
            warnings.push("Circular dependency: " + [...stack, name].join(" → "));
            return;
        }
        const avail = number(remaining[name]);
        const used = Math.min(avail, qty);
        remaining[name] = avail - used;
        qty -= used;
        if (qty <= 0) return;
        const r = recipesFor(name);
        if (!r) {
            demand[name] = (demand[name] || 0) + qty;
            return;
        }
        const batches = Math.ceil(qty / Math.max(0.000001, number(r.yield, 1)));
        const made = batches * number(r.yield, 1);
        remaining[name] = (remaining[name] || 0) + made - qty;
        crafted[name] = (crafted[name] || 0) + batches * number(r.attempts, 1);
        for (const [item, n] of r.ingredients)
            consume(item, number(n) * batches * Math.max(1, number(r.attempts, 1)), [
                ...stack,
                name,
            ]);
    }
    consume(project().goal, number(project().qty, 1));
    return { demand, crafted, warnings };
}
function renderTop() {
    fillSelect(
        $("project"),
        db.projects.map((p) => [p.id, p.name]),
        project().id
    );
    fillSelect(
        $("goal"),
        [...new Set([...db.recipes.map((r) => r.out), project().goal])]
            .sort()
            .map((s) => [s, s]),
        project().goal
    );
    $("qty").value = project().qty;
}
function reachable() {
    const seen = new Set();
    function visit(name) {
        const r = recipesFor(name);
        if (!r || seen.has(r.id)) return;
        seen.add(r.id);
        r.ingredients.forEach(([x]) => visit(x));
    }
    visit(project().goal);
    return db.recipes.filter((r) => seen.has(r.id));
}
function renderSliders() {
    const box = $("sliders");
    box.replaceChildren();
    for (const r of reachable()) {
        const card = node("div", null, { class: "stage" }),
            title = node("strong", r.out),
            value = node("span", r.attempts + " tries", { class: "num" }),
            slider = node("input", null, {
                type: "range",
                min: "1",
                max: String(Math.max(30, r.attempts)),
                step: "1",
                value: String(r.attempts),
            });
        title.append(value);
        slider.addEventListener("input", () => {
            r.attempts = Number(slider.value);
            value.textContent = r.attempts + " tries";
            save();
            renderBill();
        });
        card.append(title, slider, node("small", "1–30 tries per craft"));
        box.append(card);
    }
    if (!box.children.length)
        box.append(
            node(
                "p",
                "No recipe for the selected item. Add one in the editor."
            )
        );
}
function renderBill() {
    const { demand, crafted, warnings } = calculate(),
        body = $("bill");
    body.replaceChildren();
    const names = [
        ...new Set([
            ...Object.keys(demand),
            ...Object.keys(db.stock),
            ...Object.keys(db.prices),
        ]),
    ].sort();
    let total = 0;
    for (const name of names) {
        const needed = number(demand[name]),
            price = number(db.prices[name]);
        total += needed * price;
        const tr = node("tr", null);
        tr.append(node("td", name), node("td", fmt(needed)));
        const owned = node("input", null, {
            type: "number",
            min: "0",
            value: String(db.stock[name] || 0),
        });
        owned.addEventListener("change", () => {
            db.stock[name] = number(owned.value);
            save();
            renderBill();
        });
        tr.append(node("td", null));
        tr.children[2].append(owned);
        tr.append(node("td", fmt(needed)));
        const priceInput = node("input", null, {
            type: "number",
            min: "0",
            value: String(db.prices[name] || 0),
        });
        priceInput.addEventListener("change", () => {
            db.prices[name] = number(priceInput.value);
            save();
            renderBill();
        });
        const cell = node("td", null);
        cell.append(priceInput);
        tr.append(cell, node("td", fmt(needed * price) + " Kina"));
        body.append(tr);
    }
    $("summary").textContent =
        "Purchase cost: " +
        fmt(total) +
        " Kina · Calculated crafts: " +
        Object.values(crafted).reduce((a, b) => a + b, 0) +
        " · Materials to acquire: " +
        names.filter((n) => demand[n] > 0).length;
    $("warnings").hidden = !warnings.length;
    $("warnings").textContent = warnings.join("; ");
}
function renderRecipes() {
    const box = $("recipes");
    box.replaceChildren();
    for (const r of db.recipes) {
        const wrap = node("div", null, { class: "recipe" }),
            head = node("div", null, { class: "grid" });
        function field(label, val, fn, type = "text") {
            const f = node("div", null, { class: "field" }),
                inp = node("input", null, { type, value: String(val) });
            inp.addEventListener("change", () => {
                fn(inp.value);
                save();
                renderTop();
                renderSliders();
                renderBill();
            });
            f.append(node("label", label), inp);
            return f;
        }
        head.append(
            field("Product Name", r.out, (v) => (r.out = v)),
            field(
                "Quantity produced per craft",
                r.yield,
                (v) => (r.yield = Math.max(0.000001, number(v, 1))),
                "number"
            ),
            field(
                "tries per craft",
                r.attempts,
                (v) => (r.attempts = Math.max(1, Math.ceil(number(v, 1)))),
                "number"
            )
        );
        wrap.append(head);
        const list = node("div", null);
        r.ingredients.forEach((ing, i) => {
            const row = node("div", null, { class: "row" }),
                n = node("input", null, {
                    value: ing[0],
                    placeholder: "Materiale",
                }),
                q = node("input", null, {
                    type: "number",
                    min: "0",
                    value: String(ing[1]),
                }),
                del = node("button", "Remove", { class: "danger" });
            n.addEventListener("change", () => {
                ing[0] = n.value;
                save();
                renderSliders();
                renderBill();
            });
            q.addEventListener("change", () => {
                ing[1] = number(q.value);
                save();
                renderBill();
            });
            del.onclick = () => {
                r.ingredients.splice(i, 1);
                save();
                renderRecipes();
                renderSliders();
                renderBill();
            };
            row.append(n, q, del);
            list.append(row);
        });
        wrap.append(list);
        const actions = node("div", null, { class: "row" }),
            add = node("button", "+ Ingredient"),
            remove = node("button", "Delete Recipe", { class: "danger" });
        add.onclick = () => {
            r.ingredients.push(["New Material", 1]);
            save();
            renderRecipes();
            renderBill();
        };
        remove.onclick = () => {
            if (!confirm("Delete the recipe " + r.out + "?")) return;
            db.recipes = db.recipes.filter((x) => x.id !== r.id);
            save();
            renderAll();
        };
        actions.append(add, remove);
        wrap.append(actions);
        box.append(wrap);
    }
}
function renderAll() {
    renderTop();
    renderSliders();
    renderBill();
    renderRecipes();
}
$("project").onchange = () => {
    db.active = $("project").value;
    save();
    renderAll();
};
$("goal").onchange = () => {
    project().goal = $("goal").value;
    save();
    renderAll();
};
$("qty").onchange = () => {
    project().qty = Math.max(1, Math.ceil(number($("qty").value, 1)));
    save();
    renderBill();
};
$("newProject").onclick = () => {
    const name = prompt("Product Name:", "New Project");
    if (!name) return;
    const p = {
        id: newId(),
        name,
        goal: db.recipes[0]?.out || "New Item",
        qty: 1,
    };
    db.projects.push(p);
    db.active = p.id;
    save();
    renderAll();
};
$("duplicate").onclick = () => {
    const p = { ...project(), id: newId(), name: project().name + " (copy)" };
    db.projects.push(p);
    db.active = p.id;
    save();
    renderAll();
};
$("rename").onclick = () => {
    const name = prompt("New Name:", project().name);
    if (name) {
        project().name = name;
        save();
        renderTop();
    }
};
$("deleteProject").onclick = () => {
    if (db.projects.length === 1)
        return alert("At least one project must remain.");
    if (!confirm("Delete the project?")) return;
    db.projects = db.projects.filter((p) => p.id !== db.active);
    db.active = db.projects[0].id;
    save();
    renderAll();
};
$("addRecipe").onclick = () => {
    db.recipes.push({
        id: newId(),
        out: "New Item " + (db.recipes.length + 1),
        yield: 1,
        attempts: 1,
        ingredients: [],
    });
    save();
    renderAll();
    $("recipes").lastElementChild.scrollIntoView({ behavior: "smooth" });
};
function download(name, data, type) {
    const url = URL.createObjectURL(new Blob([data], { type }));
    const a = node("a", null, { href: url, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("exportJson").onclick = () =>
    download(
        "aion2_crafting_backup.json",
        JSON.stringify(db, null, 2),
        "application/json"
    );
$("importJson").onclick = () => $("importFile").click();
$("importFile").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
        const v = JSON.parse(await f.text());
        if (
            !Array.isArray(v.recipes) ||
            !Array.isArray(v.projects) ||
            !v.projects.length
        )
            throw Error("Invalid format");
        db = v;
        db.stock ||= {};
        db.prices ||= {};
        db.active = db.projects[0].id;
        save();
        renderAll();
    } catch (err) {
        alert("Importation failed: " + err.message);
    }
    e.target.value = "";
};
$("exportCsv").onclick = () => {
    const { demand } = calculate(),
        esc = (s) => '"' + String(s).replaceAll('"', '""') + '"';
    const lines = [
        ["Material", "To Acquire", "Unit Price", "Cost"].map(esc).join(";"),
    ];
    for (const [n, q] of Object.entries(demand))
        lines.push(
            [n, q, db.prices[n] || 0, q * (db.prices[n] || 0)].map(esc).join(";")
        );
    download(
        "aion2_distinta_base.csv",
        "\ufeff" + lines.join("\r\n"),
        "text/csv;charset=utf-8"
    );
};
renderAll();
