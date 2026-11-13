/* DiceBear core (MIT, (c) Florian Koerner) bundled for the browser */
(function () {
var M = {}, C = {};
M["Avatar.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Avatar_svg, _Avatar_resolvedOptions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const Style_js_1 = require("./Style.js");
const Options_js_1 = require("./Options.js");
const Resolver_js_1 = require("./Resolver.js");
const Renderer_js_1 = require("./Renderer.js");
/**
 * Top-level entry point for rendering an avatar from a style and options.
 *
 * Construction immediately resolves and renders the SVG; the various
 * accessor methods return different serializations of that result.
 */
class Avatar {
    /**
     * Pass a {@link Style} instance and reuse it across avatars. The parsed
     * style carries the validation, so nothing is re-checked per render.
     */
    constructor(style, optionsInput) {
        _Avatar_svg.set(this, void 0);
        _Avatar_resolvedOptions.set(this, void 0);
        if (!(style instanceof Style_js_1.Style)) {
            throw new TypeError('[DiceBear] `new Avatar()` expects a Style. Wrap the definition first: ' +
                '`new Avatar(new Style(definition), options)`.');
        }
        const options = new Options_js_1.Options(optionsInput);
        const resolver = new Resolver_js_1.Resolver(style, options);
        __classPrivateFieldSet(this, _Avatar_svg, new Renderer_js_1.Renderer(style, resolver).render(), "f");
        __classPrivateFieldSet(this, _Avatar_resolvedOptions, resolver.resolved(), "f");
    }
    /**
     * Returns the rendered SVG markup.
     */
    toString() {
        return __classPrivateFieldGet(this, _Avatar_svg, "f");
    }
    /**
     * Returns the avatar as a JSON-serializable object containing the SVG and
     * the fully resolved options used to render it.
     */
    toJSON() {
        return {
            svg: __classPrivateFieldGet(this, _Avatar_svg, "f"),
            options: structuredClone(__classPrivateFieldGet(this, _Avatar_resolvedOptions, "f")),
        };
    }
    /**
     * Returns the SVG encoded as a `data:image/svg+xml` URI.
     */
    toDataUri() {
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(__classPrivateFieldGet(this, _Avatar_svg, "f"))}`;
    }
}
exports.Avatar = Avatar;
_Avatar_svg = new WeakMap(), _Avatar_resolvedOptions = new WeakMap();

};
M["Error/CircularColorReferenceError.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularColorReferenceError = void 0;
/**
 * Thrown when a color in the style definition references itself, directly or
 * indirectly. The {@link chain} field reproduces the resolution path.
 */
class CircularColorReferenceError extends Error {
    constructor(chain) {
        const path = chain.join(' → ');
        super(`Circular color reference: ${path}`);
        this.name = 'CircularColorReferenceError';
        this.chain = chain;
    }
}
exports.CircularColorReferenceError = CircularColorReferenceError;

};
M["Error/StyleValidationError.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleValidationError = void 0;
const ValidationError_js_1 = require("./ValidationError.js");
/**
 * Thrown when a style definition fails schema validation.
 */
class StyleValidationError extends ValidationError_js_1.ValidationError {
    constructor(details) {
        super('Invalid style definition', details);
        this.name = 'StyleValidationError';
    }
}
exports.StyleValidationError = StyleValidationError;

};
M["Error/ValidationError.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
/**
 * Base class for schema validation errors. Carries the prefix in `message`
 * and the per-field failures in {@link details}.
 */
class ValidationError extends Error {
    constructor(prefix, details) {
        const parts = [];
        for (const detail of details) {
            const segments = [];
            if (detail.instancePath) {
                segments.push(detail.instancePath);
            }
            if (detail.message) {
                segments.push(detail.message);
            }
            parts.push(segments.join(' '));
        }
        super(`${prefix}: ${parts.join(', ')}`);
        this.name = 'ValidationError';
        this.details = details;
    }
}
exports.ValidationError = ValidationError;

};
M["Options.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Options_instances, _Options_data, _Options_tags, _Options_dynamic, _Options_asArray, _Options_toRange;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
/**
 * Validates the raw user-supplied options and exposes them through typed
 * accessors. Each accessor returns the user's input in a normalized form
 * (always an array for options that accept either a scalar or an array, or
 * `undefined` when the option is not set), so consumers — chiefly
 * {@link Resolver} — never have to do their own normalization.
 *
 * Resolution against the style definition and the PRNG happens in
 * {@link Resolver}; this class is purely about reading user input.
 */
class Options {
    constructor(data = {}) {
        _Options_instances.add(this);
        _Options_data.set(this, void 0);
        _Options_tags.set(this, void 0);
        __classPrivateFieldSet(this, _Options_data, structuredClone(data), "f");
    }
    seed() {
        return __classPrivateFieldGet(this, _Options_data, "f").seed;
    }
    size() {
        return __classPrivateFieldGet(this, _Options_data, "f").size;
    }
    idRandomization() {
        return __classPrivateFieldGet(this, _Options_data, "f").idRandomization;
    }
    title() {
        return __classPrivateFieldGet(this, _Options_data, "f").title;
    }
    flip() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_asArray).call(this, __classPrivateFieldGet(this, _Options_data, "f").flip);
    }
    fontFamily() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_asArray).call(this, __classPrivateFieldGet(this, _Options_data, "f").fontFamily);
    }
    fontWeight() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_asArray).call(this, __classPrivateFieldGet(this, _Options_data, "f").fontWeight);
    }
    scale() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").scale);
    }
    borderRadius() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").borderRadius);
    }
    rotate() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").rotate);
    }
    translateX() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").translateX);
    }
    translateY() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").translateY);
    }
    animation() {
        return __classPrivateFieldGet(this, _Options_data, "f").animation;
    }
    /**
     * Returns the `${name}Animation` switch for one animation name, or
     * `undefined` when unset.
     */
    animationFor(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}Animation`);
    }
    animationSpeed() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").animationSpeed);
    }
    /**
     * Returns the `${name}AnimationSpeed` option for one animation name as a
     * range, or `undefined` when unset.
     */
    animationSpeedFor(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}AnimationSpeed`));
    }
    animationDelay() {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_data, "f").animationDelay);
    }
    /**
     * Returns the `${name}AnimationDelay` option for one animation name as a
     * range, or `undefined` when unset.
     */
    animationDelayFor(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}AnimationDelay`));
    }
    /**
     * Returns the global `tags` filter as parsed tokens, or an empty array when
     * unset. Each raw token (`category` / `category:value`, optionally
     * `!`-prefixed to disallow) is decoded into `{ category, value?, negated }` so
     * the resolver composes the filter without parsing the grammar itself. An
     * empty list means no tag filtering (classic behavior). Memoized, since the
     * resolver reads it once per component.
     */
    tags() {
        var _a;
        return (__classPrivateFieldSet(this, _Options_tags, (_a = __classPrivateFieldGet(this, _Options_tags, "f")) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _Options_instances, "m", _Options_asArray).call(this, __classPrivateFieldGet(this, _Options_data, "f").tags).map((token) => {
            const negated = token.startsWith('!');
            const body = negated ? token.slice(1) : token;
            const sep = body.indexOf(':');
            return sep === -1
                ? { category: body, negated }
                : { category: body.slice(0, sep), value: body.slice(sep + 1), negated };
        }), "f"));
    }
    /**
     * Returns the user-set variant constraint for `name` as a weighted map, or
     * `undefined` when `${name}Variant` is unset. A bare string or string list
     * is normalized to a map with each entry weighted `1`.
     */
    componentVariant(name) {
        const raw = __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}Variant`);
        if (raw === undefined) {
            return undefined;
        }
        if (typeof raw === 'string') {
            return { [raw]: 1 };
        }
        if (Array.isArray(raw)) {
            return Object.fromEntries(raw.map((v) => [v, 1]));
        }
        return raw;
    }
    componentProbability(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}Probability`);
    }
    /**
     * Asymmetric on purpose: returns `undefined` (rather than `[]`) when
     * `${name}Color` is unset so the resolver can fall back to the style
     * definition's color values.
     */
    color(name) {
        const raw = __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}Color`);
        return raw === undefined
            ? undefined
            : __classPrivateFieldGet(this, _Options_instances, "m", _Options_asArray).call(this, raw);
    }
    colorFill(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_asArray).call(this, __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}ColorFill`));
    }
    colorAngle(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}ColorAngle`));
    }
    colorFillStops(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_toRange).call(this, __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}ColorFillStops`));
    }
    colorOrder(name) {
        return __classPrivateFieldGet(this, _Options_instances, "m", _Options_dynamic).call(this, `${name}ColorOrder`);
    }
}
exports.Options = Options;
_Options_data = new WeakMap(), _Options_tags = new WeakMap(), _Options_instances = new WeakSet(), _Options_dynamic = function _Options_dynamic(key) {
    return __classPrivateFieldGet(this, _Options_data, "f")[key];
}, _Options_asArray = function _Options_asArray(value) {
    if (value === undefined) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}, _Options_toRange = function _Options_toRange(value) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === 'number') {
        return { min: value, max: value };
    }
    if (value.length === 0) {
        return undefined;
    }
    return { min: Math.min(...value), max: Math.max(...value) };
};

};
M["OptionsDescriptor.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _OptionsDescriptor_instances, _a, _OptionsDescriptor_rotateRange, _OptionsDescriptor_translateRange, _OptionsDescriptor_descriptor, _OptionsDescriptor_style, _OptionsDescriptor_build;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsDescriptor = void 0;
const StyleOptions_js_1 = require("./StyleOptions.js");
/**
 * Builds a descriptor of every option a given style accepts. Tooling such as
 * the editor uses the result to render form controls and validation hints
 * without having to introspect the style itself.
 */
class OptionsDescriptor {
    constructor(style) {
        _OptionsDescriptor_instances.add(this);
        _OptionsDescriptor_descriptor.set(this, void 0);
        _OptionsDescriptor_style.set(this, void 0);
        __classPrivateFieldSet(this, _OptionsDescriptor_style, style, "f");
    }
    /**
     * Returns a deep clone of the descriptor, building it lazily on first call.
     */
    toJSON() {
        var _b;
        __classPrivateFieldSet(this, _OptionsDescriptor_descriptor, (_b = __classPrivateFieldGet(this, _OptionsDescriptor_descriptor, "f")) !== null && _b !== void 0 ? _b : __classPrivateFieldGet(this, _OptionsDescriptor_instances, "m", _OptionsDescriptor_build).call(this), "f");
        return structuredClone(__classPrivateFieldGet(this, _OptionsDescriptor_descriptor, "f"));
    }
}
exports.OptionsDescriptor = OptionsDescriptor;
_a = OptionsDescriptor, _OptionsDescriptor_descriptor = new WeakMap(), _OptionsDescriptor_style = new WeakMap(), _OptionsDescriptor_instances = new WeakSet(), _OptionsDescriptor_build = function _OptionsDescriptor_build() {
    var _b;
    const result = {
        seed: { type: 'string' },
        size: { type: 'number', min: 1, max: 4096 },
        idRandomization: { type: 'boolean' },
        title: { type: 'string' },
        flip: {
            type: 'enum',
            values: ['none', 'horizontal', 'vertical', 'both'],
            list: true,
        },
        fontFamily: { type: 'string', list: true },
        fontWeight: { type: 'number', min: 1, max: 1000, list: true },
        scale: { type: 'range', min: 0, max: 10 },
        borderRadius: { type: 'range', min: 0, max: 50 },
        rotate: __classPrivateFieldGet(_a, _a, "f", _OptionsDescriptor_rotateRange),
        translateX: __classPrivateFieldGet(_a, _a, "f", _OptionsDescriptor_translateRange),
        translateY: __classPrivateFieldGet(_a, _a, "f", _OptionsDescriptor_translateRange),
    };
    const tags = new Set();
    for (const [name, component] of __classPrivateFieldGet(this, _OptionsDescriptor_style, "f").components()) {
        if (component.extendsName() !== undefined) {
            continue;
        }
        const variants = component.variants();
        result[`${name}Variant`] = {
            type: 'enum',
            values: Array.from(variants.keys()).sort(),
            list: true,
            weighted: true,
        };
        result[`${name}Probability`] = { type: 'number', min: 0, max: 100 };
        for (const variant of variants.values()) {
            for (const tag of variant.tags()) {
                tags.add(tag);
            }
        }
    }
    for (const name of [...__classPrivateFieldGet(this, _OptionsDescriptor_style, "f").colors().keys(), 'background']) {
        const color = __classPrivateFieldGet(this, _OptionsDescriptor_style, "f").colors().get(name);
        const contrastTo = color === null || color === void 0 ? void 0 : color.contrastTo();
        const notEqualTo = (_b = color === null || color === void 0 ? void 0 : color.notEqualTo()) !== null && _b !== void 0 ? _b : [];
        result[`${name}Color`] = {
            type: 'color',
            list: true,
            ...(contrastTo ? { contrastTo } : {}),
            ...(notEqualTo.length > 0
                ? { notEqualTo: Array.from(notEqualTo) }
                : {}),
        };
        result[`${name}ColorFill`] = {
            type: 'enum',
            values: ['solid', 'linear', 'radial'],
            list: true,
        };
        result[`${name}ColorFillStops`] = { type: 'range', min: 2 };
        result[`${name}ColorAngle`] = __classPrivateFieldGet(_a, _a, "f", _OptionsDescriptor_rotateRange);
        result[`${name}ColorOrder`] = {
            type: 'enum',
            values: [StyleOptions_js_1.COLOR_ORDER_RANDOM, StyleOptions_js_1.COLOR_ORDER_FIXED],
        };
    }
    // Only advertise the `tags` filter when the style actually carries tags.
    // The values are the sorted union of every tag across the style's variants,
    // but `open` marks them as suggestions: the filter also accepts `!`
    // disallows and bare categories. Only an unknown category is ignored. An
    // unknown value inside a category the style does use matches nothing, so
    // every variant tagged on that axis is dropped.
    if (tags.size > 0) {
        result.tags = {
            type: 'enum',
            values: Array.from(tags).sort(),
            list: true,
            open: true,
        };
    }
    // Only advertise the animation options when the style carries declarative
    // animations. On a static style they are accepted but have no effect.
    // Every animation name gets its own switch, speed and delay field, in the
    // order of the name list.
    if (__classPrivateFieldGet(this, _OptionsDescriptor_style, "f").hasAnimations()) {
        result.animation = { type: 'boolean' };
        result.animationSpeed = { type: 'range', min: 0.1, max: 10 };
        result.animationDelay = { type: 'range', min: -3600, max: 3600 };
        for (const name of __classPrivateFieldGet(this, _OptionsDescriptor_style, "f").animationNames()) {
            result[`${name}Animation`] = { type: 'boolean' };
            result[`${name}AnimationSpeed`] = { type: 'range', min: 0.1, max: 10 };
            result[`${name}AnimationDelay`] = {
                type: 'range',
                min: -3600,
                max: 3600,
            };
        }
    }
    return result;
};
_OptionsDescriptor_rotateRange = { value: { type: 'range', min: -360, max: 360 } };
_OptionsDescriptor_translateRange = { value: { type: 'range', min: -1000, max: 1000 } };

};
M["Prng/Fnv1a.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fnv1a = void 0;
/**
 * FNV-1a 32-bit hash.
 *
 * Offset basis: 0x811c9dc5, prime: 0x01000193.
 *
 * @see https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
 */
class Fnv1a {
    /**
     * Returns the unsigned 32-bit FNV-1a hash of `input`. UTF-16 code units
     * are hashed directly so the result is identical across language ports.
     */
    static hash(input) {
        let hash = 0x811c9dc5;
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, 0x01000193);
        }
        return hash >>> 0;
    }
    /**
     * Returns the FNV-1a hash of `input` as an 8-character lowercase hex string.
     */
    static hex(input) {
        return Fnv1a.hash(input).toString(16).padStart(8, '0');
    }
}
exports.Fnv1a = Fnv1a;

};
M["Prng/Mulberry32.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Mulberry32_state;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mulberry32 = void 0;
const UINT32_MAX_PLUS_1 = 2 ** 32;
/**
 * Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
 *
 * C original:
 * ```c
 * uint32_t z = (x += 0x6D2B79F5UL);
 * z = (z ^ (z >> 15)) * (z | 1UL);
 * z ^= z + (z ^ (z >> 7)) * (z | 61UL);
 * return z ^ (z >> 14);
 * ```
 *
 * @see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */
class Mulberry32 {
    constructor(seed) {
        _Mulberry32_state.set(this, void 0);
        __classPrivateFieldSet(this, _Mulberry32_state, seed, "f");
    }
    /**
     * Advances the state and returns the next unsigned 32-bit value.
     */
    next() {
        const z = (__classPrivateFieldSet(this, _Mulberry32_state, (__classPrivateFieldGet(this, _Mulberry32_state, "f") + 0x6d2b79f5) | 0, "f"));
        let t = Math.imul(z ^ (z >>> 15), z | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return (t ^ (t >>> 14)) >>> 0;
    }
    /**
     * Advances the state and returns the next value in `[0, 1)`.
     */
    nextFloat() {
        return this.next() / UINT32_MAX_PLUS_1;
    }
    /**
     * Returns the current internal state, useful for snapshotting.
     */
    state() {
        return __classPrivateFieldGet(this, _Mulberry32_state, "f");
    }
}
exports.Mulberry32 = Mulberry32;
_Mulberry32_state = new WeakMap();

};
M["Prng.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Prng_instances, _Prng_seed, _Prng_uniqueByCodePoint, _Prng_compareByCodePoint;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prng = void 0;
const Fnv1a_js_1 = require("./Prng/Fnv1a.js");
const Mulberry32_js_1 = require("./Prng/Mulberry32.js");
/**
 * Key-based pseudorandom number generator.
 *
 * Each method takes a key that, combined with the seed, produces a
 * deterministic value. The same seed + key always yields the same result,
 * regardless of call order.
 */
class Prng {
    constructor(seed) {
        _Prng_instances.add(this);
        _Prng_seed.set(this, void 0);
        __classPrivateFieldSet(this, _Prng_seed, seed, "f");
    }
    /**
     * Picks a single item from `items` deterministically. Returns `undefined`
     * for an empty list. Duplicate values (by string representation) are
     * collapsed before picking so that input order and duplication do not
     * affect the result.
     */
    pick(key, items) {
        if (items.length === 0) {
            return undefined;
        }
        if (items.length === 1) {
            return items[0];
        }
        const unique = __classPrivateFieldGet(this, _Prng_instances, "m", _Prng_uniqueByCodePoint).call(this, items);
        if (unique.length === 1) {
            return unique[0];
        }
        const sorted = unique.sort(__classPrivateFieldGet(this, _Prng_instances, "m", _Prng_compareByCodePoint));
        const index = Math.floor(this.getValue(key) * sorted.length);
        return sorted[index];
    }
    /**
     * Picks a key from `weights` proportional to its weight. When all weights
     * are zero, falls back to an unweighted {@link pick}. Returns `undefined`
     * for an empty map.
     */
    weightedPick(key, weights) {
        const keys = Object.keys(weights);
        if (keys.length === 0) {
            return undefined;
        }
        if (keys.length === 1) {
            return keys[0];
        }
        const sorted = keys.sort(__classPrivateFieldGet(this, _Prng_instances, "m", _Prng_compareByCodePoint));
        const totalWeight = sorted.reduce((sum, k) => sum + weights[k], 0);
        if (totalWeight === 0) {
            return this.pick(key, sorted);
        }
        const threshold = this.getValue(key) * totalWeight;
        let cumulative = 0;
        for (const k of sorted) {
            cumulative += weights[k];
            if (threshold < cumulative) {
                return k;
            }
        }
        return sorted[sorted.length - 1];
    }
    /**
     * Returns `true` with the given probability (0–100, default 50).
     */
    bool(key, likelihood = 50) {
        return this.getValue(key) * 100 < likelihood;
    }
    /**
     * Returns a deterministic float in `range`, rounded to four decimal places.
     * With `range.step > 0`, the result is drawn uniformly from
     * `{ min + i*step | 0 ≤ i ≤ floor((max - min) / step) }`, so both endpoints
     * of an evenly-divisible range are equally likely. Non-positive or absent
     * step means continuous. `min`/`max` are sorted internally, so a reversed
     * pair is tolerated.
     */
    float(key, range) {
        var _a;
        const min = Math.min(range.min, range.max);
        const max = Math.max(range.min, range.max);
        const step = (_a = range.step) !== null && _a !== void 0 ? _a : 0;
        let value;
        if (step > 0) {
            const buckets = Math.floor((max - min) / step) + 1;
            const i = Math.floor(this.getValue(key) * buckets);
            value = min + i * step;
        }
        else {
            value = min + this.getValue(key) * (max - min);
        }
        return Math.round(value * 10000) / 10000;
    }
    /**
     * Returns a deterministic integer in `range`. `min`/`max` are sorted
     * internally, so a reversed pair is tolerated. `range.step` is accepted
     * for symmetry with {@link float} but ignored — integers already step by 1.
     */
    integer(key, range) {
        const min = Math.min(range.min, range.max);
        const max = Math.max(range.min, range.max);
        return Math.floor(this.getValue(key) * (max - min + 1)) + min;
    }
    /**
     * Fisher-Yates shuffle with chained Mulberry32 state. Duplicate values
     * (by string representation) are collapsed before shuffling, so a
     * caller's slice off the front cannot accidentally produce a repeated
     * value.
     */
    shuffle(key, items) {
        if (items.length <= 1) {
            return [...items];
        }
        const result = __classPrivateFieldGet(this, _Prng_instances, "m", _Prng_uniqueByCodePoint).call(this, items).sort(__classPrivateFieldGet(this, _Prng_instances, "m", _Prng_compareByCodePoint));
        const prng = new Mulberry32_js_1.Mulberry32(Fnv1a_js_1.Fnv1a.hash(__classPrivateFieldGet(this, _Prng_seed, "f") + ':' + key));
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(prng.nextFloat() * (i + 1));
            const temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    }
    /**
     * Returns a single float in `[0, 1)` derived from `seed:key`. The same
     * seed/key pair always produces the same value.
     */
    getValue(key) {
        return new Mulberry32_js_1.Mulberry32(Fnv1a_js_1.Fnv1a.hash(__classPrivateFieldGet(this, _Prng_seed, "f") + ':' + key)).nextFloat();
    }
}
exports.Prng = Prng;
_Prng_seed = new WeakMap(), _Prng_instances = new WeakSet(), _Prng_uniqueByCodePoint = function _Prng_uniqueByCodePoint(items, keyFn = String) {
    const seen = new Set();
    const result = [];
    for (const item of items) {
        const repr = keyFn(item);
        if (!seen.has(repr)) {
            seen.add(repr);
            result.push(item);
        }
    }
    return result;
}, _Prng_compareByCodePoint = function _Prng_compareByCodePoint(a, b) {
    const sa = String(a);
    const sb = String(b);
    if (sa < sb) {
        return -1;
    }
    if (sa > sb) {
        return 1;
    }
    return 0;
};

};
M["Renderer.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Renderer_instances, _a, _Renderer_trackOrder, _Renderer_directionCss, _Renderer_easingKeywordCss, _Renderer_style, _Renderer_resolver, _Renderer_defs, _Renderer_cachedSeedHash, _Renderer_cachedInitials, _Renderer_cachedAnimationHash, _Renderer_cachedRandomSuffix, _Renderer_keyframesCss, _Renderer_animationCss, _Renderer_keyframesByContent, _Renderer_keyframesCounter, _Renderer_animationClassCounter, _Renderer_applyFlip, _Renderer_applyScale, _Renderer_applyBorderRadius, _Renderer_applyRotate, _Renderer_applyTranslate, _Renderer_renderBackground, _Renderer_randomSuffix, _Renderer_randomizeIds, _Renderer_renderElements, _Renderer_renderElement, _Renderer_renderSvgElement, _Renderer_renderTextElement, _Renderer_renderComponentElement, _Renderer_buildTransforms, _Renderer_renderAttributes, _Renderer_resolveAttributeValue, _Renderer_resolveColorReference, _Renderer_buildGradientDef, _Renderer_resolveValue, _Renderer_resolveVariable, _Renderer_initials, _Renderer_hashSeed, _Renderer_animationHash, _Renderer_activeAnimations, _Renderer_attributesWithoutAnimatedOpacity, _Renderer_applyAnimations, _Renderer_buildAnimationCss, _Renderer_keyframesBody, _Renderer_trackDeclaration, _Renderer_easingCss, _Renderer_registerAnimationStyle;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const Fnv1a_js_1 = require("./Prng/Fnv1a.js");
const Initials_js_1 = require("./Utils/Initials.js");
const License_js_1 = require("./Utils/License.js");
const Number_js_1 = require("./Utils/Number.js");
const Xml_js_1 = require("./Utils/Xml.js");
/**
 * Walks a style's element tree and turns it into the final SVG markup.
 *
 * The renderer is single-use: it accumulates `<defs>` entries and per-render
 * caches across method calls, so a fresh instance is required per avatar.
 */
class Renderer {
    constructor(style, resolver) {
        _Renderer_instances.add(this);
        _Renderer_style.set(this, void 0);
        _Renderer_resolver.set(this, void 0);
        _Renderer_defs.set(this, new Map());
        _Renderer_cachedSeedHash.set(this, void 0);
        _Renderer_cachedInitials.set(this, void 0);
        _Renderer_cachedAnimationHash.set(this, void 0);
        _Renderer_cachedRandomSuffix.set(this, void 0);
        _Renderer_keyframesCss.set(this, []);
        _Renderer_animationCss.set(this, []);
        _Renderer_keyframesByContent.set(this, new Map());
        _Renderer_keyframesCounter.set(this, 0);
        _Renderer_animationClassCounter.set(this, 0);
        __classPrivateFieldSet(this, _Renderer_style, style, "f");
        __classPrivateFieldSet(this, _Renderer_resolver, resolver, "f");
    }
    /**
     * Builds the complete SVG document for the avatar.
     */
    render() {
        const canvas = __classPrivateFieldGet(this, _Renderer_style, "f").canvas();
        const background = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderBackground).call(this, canvas);
        let body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderElements).call(this, canvas.elements());
        // Order matters: scale and flip around center, then rotate, translate,
        // and finally clip with border radius (outermost wrapper).
        body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyScale).call(this, body, canvas);
        body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyFlip).call(this, body, canvas);
        body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyRotate).call(this, body, canvas);
        body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyTranslate).call(this, body, canvas);
        body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyBorderRadius).call(this, `${background}${body}`, canvas);
        __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_registerAnimationStyle).call(this);
        const metadata = License_js_1.License.xml(__classPrivateFieldGet(this, _Renderer_style, "f").meta());
        const defs = __classPrivateFieldGet(this, _Renderer_defs, "f").size > 0
            ? `<defs>${Array.from(__classPrivateFieldGet(this, _Renderer_defs, "f").values()).join('')}</defs>`
            : '';
        const size = __classPrivateFieldGet(this, _Renderer_resolver, "f").size();
        const title = __classPrivateFieldGet(this, _Renderer_resolver, "f").title();
        const escapedTitle = title !== undefined ? Xml_js_1.Xml.escape(title) : undefined;
        const attrs = [
            'xmlns="http://www.w3.org/2000/svg"',
            `viewBox="0 0 ${Number_js_1.Number.format(canvas.width())} ${Number_js_1.Number.format(canvas.height())}"`,
        ];
        const rootAttributes = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderAttributes).call(this, __classPrivateFieldGet(this, _Renderer_style, "f").attributes());
        if (rootAttributes) {
            attrs.push(rootAttributes.trimStart());
        }
        if (escapedTitle !== undefined) {
            attrs.push('role="img"', `aria-label="${escapedTitle}"`);
        }
        else {
            attrs.push('aria-hidden="true"');
        }
        if (size !== undefined) {
            const sizeValue = Number_js_1.Number.format(size);
            attrs.push(`width="${sizeValue}"`, `height="${sizeValue}"`);
        }
        const titleElement = escapedTitle !== undefined ? `<title>${escapedTitle}</title>` : '';
        let svg = `<svg ${attrs.join(' ')}><!-- Generated by DiceBear (https://www.dicebear.com) -->${metadata}${defs}${titleElement}${body}</svg>`;
        if (__classPrivateFieldGet(this, _Renderer_resolver, "f").idRandomization()) {
            svg = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_randomizeIds).call(this, svg);
        }
        return svg;
    }
}
exports.Renderer = Renderer;
_a = Renderer, _Renderer_style = new WeakMap(), _Renderer_resolver = new WeakMap(), _Renderer_defs = new WeakMap(), _Renderer_cachedSeedHash = new WeakMap(), _Renderer_cachedInitials = new WeakMap(), _Renderer_cachedAnimationHash = new WeakMap(), _Renderer_cachedRandomSuffix = new WeakMap(), _Renderer_keyframesCss = new WeakMap(), _Renderer_animationCss = new WeakMap(), _Renderer_keyframesByContent = new WeakMap(), _Renderer_keyframesCounter = new WeakMap(), _Renderer_animationClassCounter = new WeakMap(), _Renderer_instances = new WeakSet(), _Renderer_applyFlip = function _Renderer_applyFlip(body, canvas) {
    const flip = __classPrivateFieldGet(this, _Renderer_resolver, "f").flip();
    if (flip === 'none') {
        return body;
    }
    const w = Number_js_1.Number.format(canvas.width());
    const h = Number_js_1.Number.format(canvas.height());
    let transform;
    switch (flip) {
        case 'horizontal':
            transform = `translate(${w}, 0) scale(-1, 1)`;
            break;
        case 'vertical':
            transform = `translate(0, ${h}) scale(1, -1)`;
            break;
        case 'both':
            transform = `translate(${w}, ${h}) scale(-1, -1)`;
            break;
    }
    return `<g transform="${transform}">${body}</g>`;
}, _Renderer_applyScale = function _Renderer_applyScale(body, canvas) {
    const scale = __classPrivateFieldGet(this, _Renderer_resolver, "f").scale();
    if (scale === 1) {
        return body;
    }
    const cx = canvas.width() / 2;
    const cy = canvas.height() / 2;
    return `<g transform="translate(${Number_js_1.Number.format(cx)}, ${Number_js_1.Number.format(cy)}) scale(${Number_js_1.Number.format(scale)}) translate(${Number_js_1.Number.format(-cx)}, ${Number_js_1.Number.format(-cy)})">${body}</g>`;
}, _Renderer_applyBorderRadius = function _Renderer_applyBorderRadius(body, canvas) {
    const radius = __classPrivateFieldGet(this, _Renderer_resolver, "f").borderRadius();
    const id = `clip-${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_hashSeed).call(this)}`;
    const rx = Number_js_1.Number.format((radius / 100) * canvas.width());
    const ry = Number_js_1.Number.format((radius / 100) * canvas.height());
    __classPrivateFieldGet(this, _Renderer_defs, "f").set(id, `<clipPath id="${id}"><rect width="${Number_js_1.Number.format(canvas.width())}" height="${Number_js_1.Number.format(canvas.height())}" rx="${rx}" ry="${ry}"/></clipPath>`);
    return `<g clip-path="url(#${id})">${body}</g>`;
}, _Renderer_applyRotate = function _Renderer_applyRotate(body, canvas) {
    const rotate = __classPrivateFieldGet(this, _Renderer_resolver, "f").rotate();
    if (rotate === 0) {
        return body;
    }
    const cx = canvas.width() / 2;
    const cy = canvas.height() / 2;
    return `<g transform="rotate(${Number_js_1.Number.format(rotate)}, ${Number_js_1.Number.format(cx)}, ${Number_js_1.Number.format(cy)})">${body}</g>`;
}, _Renderer_applyTranslate = function _Renderer_applyTranslate(body, canvas) {
    const tx = __classPrivateFieldGet(this, _Renderer_resolver, "f").translateX();
    const ty = __classPrivateFieldGet(this, _Renderer_resolver, "f").translateY();
    if (tx === 0 && ty === 0) {
        return body;
    }
    const x = Number_js_1.Number.format((tx / 100) * canvas.width());
    const y = Number_js_1.Number.format((ty / 100) * canvas.height());
    return `<g transform="translate(${x}, ${y})">${body}</g>`;
}, _Renderer_renderBackground = function _Renderer_renderBackground(canvas) {
    const colors = __classPrivateFieldGet(this, _Renderer_resolver, "f").color('background');
    if (colors.length === 0) {
        return '';
    }
    return `<rect width="${Number_js_1.Number.format(canvas.width())}" height="${Number_js_1.Number.format(canvas.height())}" fill="${Xml_js_1.Xml.escape(__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_resolveColorReference).call(this, 'background'))}"/>`;
}, _Renderer_randomSuffix = function _Renderer_randomSuffix() {
    var _b;
    return (__classPrivateFieldSet(this, _Renderer_cachedRandomSuffix, (_b = __classPrivateFieldGet(this, _Renderer_cachedRandomSuffix, "f")) !== null && _b !== void 0 ? _b : Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0'), "f"));
}, _Renderer_randomizeIds = function _Renderer_randomizeIds(svg) {
    const suffix = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_randomSuffix).call(this);
    const ids = new Set();
    for (const match of svg.matchAll(/\bid="([^"]+)"/g)) {
        ids.add(match[1]);
    }
    if (ids.size === 0) {
        return svg;
    }
    const escaped = Array.from(ids, (id) => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(id="|url\\(#|href="#)(${escaped.join('|')})("|\\))`, 'g');
    return svg.replace(pattern, (_, prefix, id, end) => `${prefix}${id}-${suffix}${end}`);
}, _Renderer_renderElements = function _Renderer_renderElements(elements) {
    return elements.map((el) => __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderElement).call(this, el)).join('');
}, _Renderer_renderElement = function _Renderer_renderElement(element) {
    switch (element.type()) {
        case 'element':
            return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderSvgElement).call(this, element);
        case 'text':
            return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderTextElement).call(this, element);
        case 'component':
            return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderComponentElement).call(this, element);
    }
}, _Renderer_renderSvgElement = function _Renderer_renderSvgElement(element) {
    var _b, _c;
    const name = element.name();
    if (!name) {
        return '';
    }
    if (name === 'defs') {
        for (const child of element.children()) {
            const rendered = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderElement).call(this, child);
            if (rendered.length > 0) {
                const id = (_b = child.attributes()) === null || _b === void 0 ? void 0 : _b.id;
                const key = typeof id === 'string' ? id : `_${__classPrivateFieldGet(this, _Renderer_defs, "f").size}`;
                __classPrivateFieldGet(this, _Renderer_defs, "f").set(key, rendered);
            }
        }
        return '';
    }
    const children = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderElements).call(this, element.children());
    // A wrapper whose children all rendered to nothing, because an optional
    // component came up empty, has no content left to group. It draws
    // nothing either way, but a masked group without content has an empty
    // bounding box, and strict SVG parsers reject the whole document over
    // it. Wrappers that carry an id stay, so references keep resolving.
    if (children.length === 0 &&
        element.children().length > 0 &&
        ((_c = element.attributes()) === null || _c === void 0 ? void 0 : _c.id) === undefined) {
        return '';
    }
    // The animation switches are read once the element is known to render,
    // after its children, so the resolved options record them in one order
    // regardless of the attributes the element carries.
    const active = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_activeAnimations).call(this, element);
    const attrs = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderAttributes).call(this, __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_attributesWithoutAnimatedOpacity).call(this, element.attributes(), active));
    if (children.length === 0) {
        return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyAnimations).call(this, `<${name}${attrs}/>`, element, active);
    }
    return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyAnimations).call(this, `<${name}${attrs}>${children}</${name}>`, element, active);
}, _Renderer_renderTextElement = function _Renderer_renderTextElement(element) {
    const value = element.value();
    return value !== undefined ? Xml_js_1.Xml.escape(__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_resolveValue).call(this, value)) : '';
}, _Renderer_renderComponentElement = function _Renderer_renderComponentElement(element) {
    const componentName = element.name();
    if (typeof componentName !== 'string') {
        return '';
    }
    const variantName = __classPrivateFieldGet(this, _Renderer_resolver, "f").variant(componentName);
    if (!variantName) {
        return '';
    }
    const component = __classPrivateFieldGet(this, _Renderer_style, "f").components().get(componentName);
    if (!component) {
        return '';
    }
    const variant = component.variants().get(variantName);
    if (!variant) {
        return '';
    }
    const id = `${component.sourceName()}-${variantName}-${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_hashSeed).call(this)}`;
    if (!__classPrivateFieldGet(this, _Renderer_defs, "f").has(id)) {
        const body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderElements).call(this, variant.elements());
        __classPrivateFieldGet(this, _Renderer_defs, "f").set(id, `<g id="${id}">${body}</g>`);
    }
    const transforms = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_buildTransforms).call(this, component);
    const active = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_activeAnimations).call(this, element);
    const userAttributes = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_attributesWithoutAnimatedOpacity).call(this, element.attributes(), active);
    let mergedAttributes = userAttributes;
    if (transforms.length > 0) {
        const userTransform = userAttributes === null || userAttributes === void 0 ? void 0 : userAttributes.transform;
        const allParts = typeof userTransform === 'string' && userTransform.length > 0
            ? [userTransform, ...transforms]
            : transforms;
        mergedAttributes = { ...userAttributes, transform: allParts.join(' ') };
    }
    const attrs = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderAttributes).call(this, mergedAttributes);
    return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_applyAnimations).call(this, `<use${attrs} href="#${id}"/>`, element, active);
}, _Renderer_buildTransforms = function _Renderer_buildTransforms(component) {
    const { rotate, translateX, translateY, scale } = __classPrivateFieldGet(this, _Renderer_resolver, "f").componentTransform(component.name());
    if (translateX === 0 && translateY === 0 && rotate === 0 && scale === 1) {
        return [];
    }
    const transforms = [];
    const cx = component.width() / 2;
    const cy = component.height() / 2;
    const cxValue = Number_js_1.Number.format(cx);
    const cyValue = Number_js_1.Number.format(cy);
    if (translateX !== 0 || translateY !== 0) {
        const x = Number_js_1.Number.format((translateX / 100) * component.width());
        const y = Number_js_1.Number.format((translateY / 100) * component.height());
        transforms.push(`translate(${x}, ${y})`);
    }
    if (rotate !== 0) {
        transforms.push(`rotate(${Number_js_1.Number.format(rotate)}, ${cxValue}, ${cyValue})`);
    }
    if (scale !== 1) {
        transforms.push(`translate(${cxValue}, ${cyValue}) scale(${Number_js_1.Number.format(scale)}) translate(${Number_js_1.Number.format(-cx)}, ${Number_js_1.Number.format(-cy)})`);
    }
    return transforms;
}, _Renderer_renderAttributes = function _Renderer_renderAttributes(attributes) {
    if (!attributes) {
        return '';
    }
    const parts = [];
    for (const [key, value] of Object.entries(attributes)) {
        if (value === undefined) {
            continue;
        }
        parts.push(`${key}="${Xml_js_1.Xml.escape(__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_resolveAttributeValue).call(this, value))}"`);
    }
    if (parts.length === 0) {
        return '';
    }
    return ` ${parts.join(' ')}`;
}, _Renderer_resolveAttributeValue = function _Renderer_resolveAttributeValue(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value.type === 'color') {
        return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_resolveColorReference).call(this, value.name);
    }
    return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_resolveVariable).call(this, value.name);
}, _Renderer_resolveColorReference = function _Renderer_resolveColorReference(name) {
    var _b;
    const colors = __classPrivateFieldGet(this, _Renderer_resolver, "f").color(name);
    const fill = __classPrivateFieldGet(this, _Renderer_resolver, "f").colorFill(name);
    if (fill === 'solid' || colors.length <= 1) {
        return (_b = colors[0]) !== null && _b !== void 0 ? _b : 'none';
    }
    return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_buildGradientDef).call(this, name, colors, fill);
}, _Renderer_buildGradientDef = function _Renderer_buildGradientDef(name, colors, fill) {
    const rotation = __classPrivateFieldGet(this, _Renderer_resolver, "f").colorAngle(name);
    const id = `${name}-color-${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_hashSeed).call(this)}`;
    const tag = fill === 'linear' ? 'linearGradient' : 'radialGradient';
    const rotateAttr = rotation !== 0
        ? ` gradientTransform="rotate(${Number_js_1.Number.format(rotation)}, 0.5, 0.5)"`
        : '';
    const stops = colors.map((color, i) => {
        const offset = Number_js_1.Number.format((i / (colors.length - 1)) * 100);
        return `<stop offset="${offset}%" stop-color="${Xml_js_1.Xml.escape(color)}"/>`;
    });
    __classPrivateFieldGet(this, _Renderer_defs, "f").set(id, `<${tag} id="${id}"${rotateAttr}>${stops.join('')}</${tag}>`);
    return `url(#${id})`;
}, _Renderer_resolveValue = function _Renderer_resolveValue(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value.type === 'variable') {
        return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_resolveVariable).call(this, value.name);
    }
    return '';
}, _Renderer_resolveVariable = function _Renderer_resolveVariable(name) {
    switch (name) {
        case 'initial': {
            // charAt(0) would return a lone surrogate (ill-formed XML) for
            // supplementary-plane initials; take the full first code point
            // instead, like the other ports.
            const first = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_initials).call(this).codePointAt(0);
            return first !== undefined ? String.fromCodePoint(first) : '';
        }
        case 'initials':
            return __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_initials).call(this);
        case 'fontWeight':
            return Number_js_1.Number.format(__classPrivateFieldGet(this, _Renderer_resolver, "f").fontWeight());
        case 'fontFamily':
            return __classPrivateFieldGet(this, _Renderer_resolver, "f").fontFamily();
    }
}, _Renderer_initials = function _Renderer_initials() {
    var _b;
    return (__classPrivateFieldSet(this, _Renderer_cachedInitials, (_b = __classPrivateFieldGet(this, _Renderer_cachedInitials, "f")) !== null && _b !== void 0 ? _b : Initials_js_1.Initials.fromSeed(__classPrivateFieldGet(this, _Renderer_resolver, "f").seed()), "f"));
}, _Renderer_hashSeed = function _Renderer_hashSeed() {
    var _b, _c;
    return (__classPrivateFieldSet(this, _Renderer_cachedSeedHash, (_b = __classPrivateFieldGet(this, _Renderer_cachedSeedHash, "f")) !== null && _b !== void 0 ? _b : Fnv1a_js_1.Fnv1a.hex(((_c = __classPrivateFieldGet(this, _Renderer_style, "f").meta().source().name()) !== null && _c !== void 0 ? _c : '') + ':' + __classPrivateFieldGet(this, _Renderer_resolver, "f").seed()), "f"));
}, _Renderer_animationHash = function _Renderer_animationHash() {
    var _b;
    if (__classPrivateFieldGet(this, _Renderer_cachedAnimationHash, "f") !== undefined) {
        return __classPrivateFieldGet(this, _Renderer_cachedAnimationHash, "f");
    }
    const random = __classPrivateFieldGet(this, _Renderer_resolver, "f").idRandomization()
        ? ':' + __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_randomSuffix).call(this)
        : '';
    // Every named timeline the style carries joins the hash with its state,
    // `off` or the factor and offset it plays at, so two renders that differ
    // only in a per-name animation option never share their rules. The style
    // lists its names in byte order already.
    const states = __classPrivateFieldGet(this, _Renderer_style, "f")
        .animationNames()
        .map((name) => __classPrivateFieldGet(this, _Renderer_resolver, "f").animationPlays(name)
        ? `${name}:${Number_js_1.Number.format(__classPrivateFieldGet(this, _Renderer_resolver, "f").animationSpeedFor(name))}:${Number_js_1.Number.format(__classPrivateFieldGet(this, _Renderer_resolver, "f").animationDelayFor(name))}`
        : `${name}:off`);
    const named = states.length > 0 ? ':' + states.join(',') : '';
    return (__classPrivateFieldSet(this, _Renderer_cachedAnimationHash, Fnv1a_js_1.Fnv1a.hex(((_b = __classPrivateFieldGet(this, _Renderer_style, "f").meta().source().name()) !== null && _b !== void 0 ? _b : '') +
        ':' +
        __classPrivateFieldGet(this, _Renderer_resolver, "f").seed() +
        ':' +
        Number_js_1.Number.format(__classPrivateFieldGet(this, _Renderer_resolver, "f").animationSpeed()) +
        ':' +
        Number_js_1.Number.format(__classPrivateFieldGet(this, _Renderer_resolver, "f").animationDelay()) +
        named +
        random), "f"));
}, _Renderer_activeAnimations = function _Renderer_activeAnimations(element) {
    const animations = element.animations();
    if (animations.length === 0) {
        return animations;
    }
    // The global switch is read first so it lands in the resolved options
    // whenever a node carries animations, on or off. Named timelines then
    // follow their own switch when the user set one.
    __classPrivateFieldGet(this, _Renderer_resolver, "f").animation();
    return animations.filter((animation) => __classPrivateFieldGet(this, _Renderer_resolver, "f").animationPlays(animation.name));
}, _Renderer_attributesWithoutAnimatedOpacity = function _Renderer_attributesWithoutAnimatedOpacity(attributes, active) {
    if ((attributes === null || attributes === void 0 ? void 0 : attributes.opacity) === undefined ||
        !active.some((animation) => animation.tracks.opacity !== undefined)) {
        return attributes;
    }
    const rest = { ...attributes };
    delete rest.opacity;
    return rest;
}, _Renderer_applyAnimations = function _Renderer_applyAnimations(markup, element, active) {
    var _b;
    if (markup.length === 0 || active.length === 0) {
        return markup;
    }
    const classes = [];
    let opacityWrapper = -1;
    for (const animation of active) {
        for (const track of __classPrivateFieldGet(_a, _a, "f", _Renderer_trackOrder)) {
            const trackData = animation.tracks[track];
            if (trackData !== undefined) {
                if (track === 'opacity') {
                    opacityWrapper = classes.length;
                }
                classes.push(__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_buildAnimationCss).call(this, animation, track, trackData.keyframes));
            }
        }
    }
    const restingOpacity = (_b = element.attributes()) === null || _b === void 0 ? void 0 : _b.opacity;
    let result = markup;
    for (let i = classes.length - 1; i >= 0; i--) {
        const opacity = i === opacityWrapper && restingOpacity !== undefined
            ? __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_renderAttributes).call(this, { opacity: restingOpacity })
            : '';
        result = `<g class="${classes[i]}"${opacity}>${result}</g>`;
    }
    return result;
}, _Renderer_buildAnimationCss = function _Renderer_buildAnimationCss(animation, track, keyframes) {
    var _b, _c, _d, _e, _f;
    var _g, _h, _j, _k;
    const defaultEasing = (_b = animation.easing) !== null && _b !== void 0 ? _b : 'linear';
    const body = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_keyframesBody).call(this, track, keyframes, defaultEasing);
    let keyframesName = __classPrivateFieldGet(this, _Renderer_keyframesByContent, "f").get(body);
    if (keyframesName === undefined) {
        keyframesName = `dbk-${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_animationHash).call(this)}-${__classPrivateFieldSet(this, _Renderer_keyframesCounter, (_h = __classPrivateFieldGet(this, _Renderer_keyframesCounter, "f"), _g = _h++, _h), "f"), _g}`;
        __classPrivateFieldGet(this, _Renderer_keyframesByContent, "f").set(body, keyframesName);
        __classPrivateFieldGet(this, _Renderer_keyframesCss, "f").push(`@keyframes ${keyframesName}{${body}}`);
    }
    const speed = __classPrivateFieldGet(this, _Renderer_resolver, "f").animationSpeedFor(animation.name);
    const duration = Number_js_1.Number.format(animation.duration / speed);
    // The user's offset is in seconds of playback, so it is added after the
    // speed has scaled the authored delay.
    const delay = Number_js_1.Number.format(((_c = animation.delay) !== null && _c !== void 0 ? _c : 0) / speed +
        __classPrivateFieldGet(this, _Renderer_resolver, "f").animationDelayFor(animation.name));
    const iterations = animation.iterations === undefined || animation.iterations === 'infinite'
        ? 'infinite'
        : Number_js_1.Number.format(animation.iterations);
    const direction = __classPrivateFieldGet(_a, _a, "f", _Renderer_directionCss)[(_d = animation.direction) !== null && _d !== void 0 ? _d : 'normal'];
    const fill = (_e = animation.fill) !== null && _e !== void 0 ? _e : 'none';
    // Only rotate and scale pivot around a point. Translation and opacity
    // need no origin, so their rules skip the transform-box prefix.
    const needsOrigin = track === 'rotate' || track === 'scaleX' || track === 'scaleY';
    const origin = (_f = animation.origin) !== null && _f !== void 0 ? _f : { x: 50, y: 50 };
    const originCss = needsOrigin
        ? `transform-box:fill-box;transform-origin:${Number_js_1.Number.format(origin.x)}% ${Number_js_1.Number.format(origin.y)}%;`
        : '';
    const className = `dba-${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_animationHash).call(this)}-${__classPrivateFieldSet(this, _Renderer_animationClassCounter, (_k = __classPrivateFieldGet(this, _Renderer_animationClassCounter, "f"), _j = _k++, _k), "f"), _j}`;
    // The name comes last in the shorthand so it can never be mistaken for a
    // keyword. All seven tokens are always emitted so every port serializes
    // the same string.
    __classPrivateFieldGet(this, _Renderer_animationCss, "f").push(`.${className}{${originCss}animation:${duration}s ${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_easingCss).call(this, defaultEasing)} ${delay}s ${iterations} ${direction} ${fill} ${keyframesName}}`);
    return className;
}, _Renderer_keyframesBody = function _Renderer_keyframesBody(track, keyframes, defaultEasing) {
    const list = [...keyframes];
    if (list[0].at > 0) {
        list.unshift({ at: 0, value: list[0].value });
    }
    const last = list[list.length - 1];
    if (last.at < 100) {
        list.push({ at: 100, value: last.value });
    }
    const defaultCss = __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_easingCss).call(this, defaultEasing);
    return list
        .map((keyframe, index) => {
        const easingCss = keyframe.easing !== undefined && index < list.length - 1
            ? __classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_easingCss).call(this, keyframe.easing)
            : defaultCss;
        const timing = easingCss !== defaultCss
            ? `;animation-timing-function:${easingCss}`
            : '';
        return `${Number_js_1.Number.format(keyframe.at)}%{${__classPrivateFieldGet(this, _Renderer_instances, "m", _Renderer_trackDeclaration).call(this, track, keyframe.value)}${timing}}`;
    })
        .join('');
}, _Renderer_trackDeclaration = function _Renderer_trackDeclaration(track, value) {
    const v = Number_js_1.Number.format(value);
    switch (track) {
        case 'translateX':
            return `transform:translateX(${v}px)`;
        case 'translateY':
            return `transform:translateY(${v}px)`;
        case 'rotate':
            return `transform:rotate(${v}deg)`;
        case 'scaleX':
            return `transform:scaleX(${v})`;
        case 'scaleY':
            return `transform:scaleY(${v})`;
        case 'opacity':
            return `opacity:${v}`;
    }
}, _Renderer_easingCss = function _Renderer_easingCss(easing) {
    if (typeof easing === 'string') {
        return __classPrivateFieldGet(_a, _a, "f", _Renderer_easingKeywordCss)[easing];
    }
    return `cubic-bezier(${Number_js_1.Number.format(easing.x1)}, ${Number_js_1.Number.format(easing.y1)}, ${Number_js_1.Number.format(easing.x2)}, ${Number_js_1.Number.format(easing.y2)})`;
}, _Renderer_registerAnimationStyle = function _Renderer_registerAnimationStyle() {
    if (__classPrivateFieldGet(this, _Renderer_keyframesCss, "f").length === 0) {
        return;
    }
    // An authored def may carry the id `animation-style`, so the CSS takes
    // the next free key rather than replacing that def.
    let key = 'animation-style';
    while (__classPrivateFieldGet(this, _Renderer_defs, "f").has(key)) {
        key += '-';
    }
    __classPrivateFieldGet(this, _Renderer_defs, "f").set(key, `<style>@media (prefers-reduced-motion:no-preference){${__classPrivateFieldGet(this, _Renderer_keyframesCss, "f").join('')}${__classPrivateFieldGet(this, _Renderer_animationCss, "f").join('')}}</style>`);
};
/**
 * The canonical track order, outermost wrapper to innermost. It mirrors the
 * usual translate → rotate → scale transform composition. Every port must
 * wrap in this exact order for the outputs to stay byte-identical.
 */
_Renderer_trackOrder = { value: [
        'translateX',
        'translateY',
        'rotate',
        'scaleX',
        'scaleY',
        'opacity',
    ] };
_Renderer_directionCss = { value: {
        normal: 'normal',
        reverse: 'reverse',
        alternate: 'alternate',
        alternateReverse: 'alternate-reverse',
    } };
_Renderer_easingKeywordCss = { value: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        hold: 'step-end',
    } };

};
M["Resolver.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Resolver_instances, _Resolver_style, _Resolver_options, _Resolver_prng, _Resolver_colorResolving, _Resolver_result, _Resolver_tagFilterCache, _Resolver_probability, _Resolver_isVisible, _Resolver_variantWeights, _Resolver_tagFilter, _Resolver_tagFilteredNames, _Resolver_resolveColor, _Resolver_order, _Resolver_colorFillStops, _Resolver_memoFloat, _Resolver_memo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const Prng_js_1 = require("./Prng.js");
const Color_js_1 = require("./Utils/Color.js");
const CircularColorReferenceError_js_1 = require("./Error/CircularColorReferenceError.js");
const StyleOptions_js_1 = require("./StyleOptions.js");
/**
 * Bundles the three inputs needed to derive any deterministic value for an
 * avatar — the {@link Style}, the validated user {@link Options}, and a
 * seeded {@link Prng} — and exposes them as named accessors. Each accessor
 * memoizes its result so that repeated calls cannot drift. The memo also
 * serves as the informational snapshot returned by {@link resolved} — every
 * value the resolver picks during one resolution lands there, except for
 * the raw seed.
 */
class Resolver {
    constructor(style, options) {
        _Resolver_instances.add(this);
        _Resolver_style.set(this, void 0);
        _Resolver_options.set(this, void 0);
        _Resolver_prng.set(this, void 0);
        _Resolver_colorResolving.set(this, []);
        _Resolver_result.set(this, {});
        _Resolver_tagFilterCache.set(this, void 0);
        __classPrivateFieldSet(this, _Resolver_style, style, "f");
        __classPrivateFieldSet(this, _Resolver_options, options, "f");
        __classPrivateFieldSet(this, _Resolver_prng, new Prng_js_1.Prng(this.seed()), "f");
    }
    seed() {
        var _a;
        // Deliberately not memoized — the seed is the only input we keep out of
        // the {@link resolved} snapshot, so a serialized avatar never leaks it.
        return (_a = __classPrivateFieldGet(this, _Resolver_options, "f").seed()) !== null && _a !== void 0 ? _a : '';
    }
    size() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'size', () => __classPrivateFieldGet(this, _Resolver_options, "f").size());
    }
    idRandomization() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'idRandomization', () => { var _a; return (_a = __classPrivateFieldGet(this, _Resolver_options, "f").idRandomization()) !== null && _a !== void 0 ? _a : false; });
    }
    animation() {
        // Deliberately without PRNG involvement: whether an avatar animates must
        // not depend on the seed.
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'animation', () => { var _a; return (_a = __classPrivateFieldGet(this, _Resolver_options, "f").animation()) !== null && _a !== void 0 ? _a : false; });
    }
    /**
     * Whether one timeline plays. A named timeline follows its
     * `${name}Animation` switch when the user set one, recorded under that
     * key, and the global `animation` switch otherwise. Unnamed timelines
     * always follow the global switch.
     */
    animationPlays(name) {
        const value = name === undefined ? undefined : __classPrivateFieldGet(this, _Resolver_options, "f").animationFor(name);
        if (name === undefined || value === undefined) {
            return this.animation();
        }
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, `${name}Animation`, () => value);
    }
    animationSpeed() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'animationSpeed', __classPrivateFieldGet(this, _Resolver_options, "f").animationSpeed(), 1);
    }
    /**
     * Returns the speed factor of one timeline. A named timeline plays at its
     * `${name}AnimationSpeed` option when the user set one, drawn under that
     * key, and at the global factor otherwise. Unnamed timelines always follow
     * the global factor.
     */
    animationSpeedFor(name) {
        const range = name === undefined ? undefined : __classPrivateFieldGet(this, _Resolver_options, "f").animationSpeedFor(name);
        if (name === undefined || range === undefined) {
            return this.animationSpeed();
        }
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}AnimationSpeed`, range, 1);
    }
    animationDelay() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'animationDelay', __classPrivateFieldGet(this, _Resolver_options, "f").animationDelay(), 0);
    }
    /**
     * Returns the start offset of one timeline in seconds. A named timeline
     * uses its `${name}AnimationDelay` option when the user set one, drawn
     * under that key, and the global offset otherwise. Unnamed timelines
     * always follow the global offset.
     */
    animationDelayFor(name) {
        const range = name === undefined ? undefined : __classPrivateFieldGet(this, _Resolver_options, "f").animationDelayFor(name);
        if (name === undefined || range === undefined) {
            return this.animationDelay();
        }
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}AnimationDelay`, range, 0);
    }
    title() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'title', () => __classPrivateFieldGet(this, _Resolver_options, "f").title());
    }
    flip() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'flip', () => { var _a; return (_a = __classPrivateFieldGet(this, _Resolver_prng, "f").pick('flip', __classPrivateFieldGet(this, _Resolver_options, "f").flip())) !== null && _a !== void 0 ? _a : 'none'; });
    }
    fontFamily() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'fontFamily', () => { var _a; return (_a = __classPrivateFieldGet(this, _Resolver_prng, "f").pick('fontFamily', __classPrivateFieldGet(this, _Resolver_options, "f").fontFamily())) !== null && _a !== void 0 ? _a : 'system-ui'; });
    }
    fontWeight() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, 'fontWeight', () => { var _a; return (_a = __classPrivateFieldGet(this, _Resolver_prng, "f").pick('fontWeight', __classPrivateFieldGet(this, _Resolver_options, "f").fontWeight())) !== null && _a !== void 0 ? _a : 400; });
    }
    scale() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'scale', __classPrivateFieldGet(this, _Resolver_options, "f").scale(), 1);
    }
    borderRadius() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'borderRadius', __classPrivateFieldGet(this, _Resolver_options, "f").borderRadius(), 0);
    }
    rotate() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'rotate', __classPrivateFieldGet(this, _Resolver_options, "f").rotate(), 0);
    }
    translateX() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'translateX', __classPrivateFieldGet(this, _Resolver_options, "f").translateX(), 0);
    }
    translateY() {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, 'translateY', __classPrivateFieldGet(this, _Resolver_options, "f").translateY(), 0);
    }
    /**
     * Selects a variant for the given component. The pool the PRNG draws from is
     * built from the per-component `${name}Variant` option and the global `tags`
     * filter (see {@link #variantWeights}). Only variants that exist in the style
     * definition are considered.
     */
    variant(name) {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, `${name}Variant`, () => {
            const component = __classPrivateFieldGet(this, _Resolver_style, "f").components().get(name);
            if (!component || !__classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_isVisible).call(this, name, component)) {
                return undefined;
            }
            return __classPrivateFieldGet(this, _Resolver_prng, "f").weightedPick(`${name}Variant`, __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_variantWeights).call(this, component));
        });
    }
    color(name) {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, `${name}Color`, () => __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_resolveColor).call(this, name));
    }
    colorFill(name) {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, `${name}ColorFill`, () => { var _a; return (_a = __classPrivateFieldGet(this, _Resolver_prng, "f").pick(`${name}ColorFill`, __classPrivateFieldGet(this, _Resolver_options, "f").colorFill(name))) !== null && _a !== void 0 ? _a : 'solid'; });
    }
    colorAngle(name) {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}ColorAngle`, __classPrivateFieldGet(this, _Resolver_options, "f").colorAngle(name), 0);
    }
    colorOrder(name) {
        var _a;
        // Deliberately not memoized: unlike colorFill this is no PRNG pick, so it
        // stays out of the {@link resolved} snapshot.
        return (_a = __classPrivateFieldGet(this, _Resolver_options, "f").colorOrder(name)) !== null && _a !== void 0 ? _a : StyleOptions_js_1.COLOR_ORDER_RANDOM;
    }
    /**
     * Picks the rotate/translateX/translateY/scale values for a single
     * component. Memoized per `name`, so the four values land in
     * {@link resolved} as `${name}Rotate` / `${name}TranslateX` /
     * `${name}TranslateY` / `${name}Scale` for downstream introspection.
     */
    componentTransform(name) {
        const component = __classPrivateFieldGet(this, _Resolver_style, "f").components().get(name);
        return {
            rotate: __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}Rotate`, component === null || component === void 0 ? void 0 : component.rotate(), 0),
            translateX: __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}TranslateX`, component === null || component === void 0 ? void 0 : component.translate().x(), 0),
            translateY: __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}TranslateY`, component === null || component === void 0 ? void 0 : component.translate().y(), 0),
            scale: __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memoFloat).call(this, `${name}Scale`, component === null || component === void 0 ? void 0 : component.scale(), 1),
        };
    }
    /**
     * Returns an informational snapshot of every value the resolver picked.
     * Includes top-level options (scale/rotate/translate/…), per-component
     * variants/probabilities/colors, and per-component transform picks. The
     * raw seed is deliberately excluded.
     *
     * The snapshot is NOT a round-trip-able options object — extra keys like
     * `${name}Rotate` are not part of {@link StyleOptions} and feeding the
     * snapshot back into a new {@link Avatar} is not supported. Callers that
     * need to reproduce an avatar should pass the original `seed` and
     * user-supplied options.
     *
     * The returned object aliases the internal cache; callers that need
     * isolation (e.g. {@link Avatar.toJSON}) clone it themselves.
     */
    resolved() {
        return __classPrivateFieldGet(this, _Resolver_result, "f");
    }
}
exports.Resolver = Resolver;
_Resolver_style = new WeakMap(), _Resolver_options = new WeakMap(), _Resolver_prng = new WeakMap(), _Resolver_colorResolving = new WeakMap(), _Resolver_result = new WeakMap(), _Resolver_tagFilterCache = new WeakMap(), _Resolver_instances = new WeakSet(), _Resolver_probability = function _Resolver_probability(component) {
    const raw = __classPrivateFieldGet(this, _Resolver_options, "f").componentProbability(component.sourceName());
    return raw !== null && raw !== void 0 ? raw : component.probability();
}, _Resolver_isVisible = function _Resolver_isVisible(name, component) {
    return __classPrivateFieldGet(this, _Resolver_prng, "f").bool(`${name}Probability`, __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_probability).call(this, component));
}, _Resolver_variantWeights = function _Resolver_variantWeights(component) {
    const variants = component.variants();
    const named = __classPrivateFieldGet(this, _Resolver_options, "f").componentVariant(component.sourceName());
    const weights = {};
    const names = named
        ? Object.keys(named)
        : __classPrivateFieldGet(this, _Resolver_options, "f").tags().length > 0
            ? __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_tagFilteredNames).call(this, variants)
            : variants.keys();
    for (const name of names) {
        const variant = variants.get(name);
        if (variant !== undefined) {
            weights[name] = named ? named[name] : variant.weight();
        }
    }
    return weights;
}, _Resolver_tagFilter = function _Resolver_tagFilter() {
    var _a;
    if (__classPrivateFieldGet(this, _Resolver_tagFilterCache, "f")) {
        return __classPrivateFieldGet(this, _Resolver_tagFilterCache, "f");
    }
    const allows = new Map();
    const bares = new Set();
    const disallows = [];
    const bareDisallows = new Set();
    for (const { category, value, negated } of __classPrivateFieldGet(this, _Resolver_options, "f").tags()) {
        if (negated) {
            disallows.push({ category, value });
            if (value === undefined) {
                bareDisallows.add(category);
            }
        }
        else if (value !== undefined) {
            const values = (_a = allows.get(category)) !== null && _a !== void 0 ? _a : [];
            values.push(value);
            allows.set(category, values);
        }
        else {
            bares.add(category);
        }
    }
    __classPrivateFieldSet(this, _Resolver_tagFilterCache, {
        // Materialize the allow groups once, not on every variant.
        allowGroups: [...allows],
        bares,
        disallows,
        bareDisallows,
    }, "f");
    return __classPrivateFieldGet(this, _Resolver_tagFilterCache, "f");
}, _Resolver_tagFilteredNames = function _Resolver_tagFilteredNames(variants) {
    const { allowGroups, bares, disallows, bareDisallows } = __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_tagFilter).call(this);
    // A bare token only binds where its category is in use, so this narrowing
    // — unlike the classification above — is genuinely per-component.
    const required = [...bares].filter((category) => {
        if (bareDisallows.has(category)) {
            return false;
        }
        for (const variant of variants.values()) {
            if (variant.hasTag(category)) {
                return true;
            }
        }
        return false;
    });
    const names = [];
    for (const [name, variant] of variants) {
        const allowed = allowGroups.every(([category, values]) => !variant.hasTag(category) ||
            values.some((value) => variant.hasTag(category, value))) && required.every((category) => variant.hasTag(category));
        const disallowed = disallows.some(({ category, value }) => variant.hasTag(category, value));
        if (allowed && !disallowed) {
            names.push(name);
        }
    }
    return names;
}, _Resolver_resolveColor = function _Resolver_resolveColor(name) {
    var _a;
    const userColors = __classPrivateFieldGet(this, _Resolver_options, "f").color(name);
    const styleColor = __classPrivateFieldGet(this, _Resolver_style, "f").colors().get(name);
    const source = (_a = userColors !== null && userColors !== void 0 ? userColors : styleColor === null || styleColor === void 0 ? void 0 : styleColor.values()) !== null && _a !== void 0 ? _a : [];
    let candidates = source.map((c) => Color_js_1.Color.toHex(c));
    const fixed = this.colorOrder(name) === StyleOptions_js_1.COLOR_ORDER_FIXED;
    const fill = this.colorFill(name);
    const stops = fill === 'solid'
        ? 1
        : __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_colorFillStops).call(this, name, fixed ? candidates.length : 2);
    if (!styleColor) {
        return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_order).call(this, name, candidates, fixed).slice(0, stops);
    }
    // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
    if (__classPrivateFieldGet(this, _Resolver_colorResolving, "f").includes(name)) {
        throw new CircularColorReferenceError_js_1.CircularColorReferenceError(__classPrivateFieldGet(this, _Resolver_colorResolving, "f").concat(name));
    }
    __classPrivateFieldGet(this, _Resolver_colorResolving, "f").push(name);
    const contrastTo = styleColor.contrastTo();
    const notEqualTo = styleColor.notEqualTo();
    try {
        if (contrastTo && !fixed) {
            const refColor = this.color(contrastTo)[0];
            if (refColor) {
                candidates = Color_js_1.Color.sortByContrast(candidates, refColor);
            }
        }
        if (notEqualTo.length > 0) {
            const excluded = [];
            for (const ref of notEqualTo) {
                for (const color of this.color(ref)) {
                    excluded.push(color);
                }
            }
            candidates = Color_js_1.Color.filterNotEqualTo(candidates, excluded);
        }
    }
    finally {
        __classPrivateFieldGet(this, _Resolver_colorResolving, "f").pop();
    }
    // Skip shuffle when sorted by contrast to preserve the ordering
    const ordered = contrastTo
        ? candidates
        : __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_order).call(this, name, candidates, fixed);
    return ordered.slice(0, stops);
}, _Resolver_order = function _Resolver_order(name, candidates, fixed) {
    return fixed ? candidates : __classPrivateFieldGet(this, _Resolver_prng, "f").shuffle(`${name}Color`, candidates);
}, _Resolver_colorFillStops = function _Resolver_colorFillStops(name, fallback) {
    const range = __classPrivateFieldGet(this, _Resolver_options, "f").colorFillStops(name);
    return range
        ? __classPrivateFieldGet(this, _Resolver_prng, "f").integer(`${name}ColorFillStops`, range)
        : fallback;
}, _Resolver_memoFloat = function _Resolver_memoFloat(key, range, fallback) {
    return __classPrivateFieldGet(this, _Resolver_instances, "m", _Resolver_memo).call(this, key, () => range ? __classPrivateFieldGet(this, _Resolver_prng, "f").float(key, range) : fallback);
}, _Resolver_memo = function _Resolver_memo(key, compute) {
    if (key in __classPrivateFieldGet(this, _Resolver_result, "f")) {
        return __classPrivateFieldGet(this, _Resolver_result, "f")[key];
    }
    const value = compute();
    __classPrivateFieldGet(this, _Resolver_result, "f")[key] = value;
    return value;
};

};
M["Style/Canvas.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Canvas_data, _Canvas_elements;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
const Element_js_1 = require("./Element.js");
/**
 * Read-only view over a style definition's `canvas` block, exposing the
 * drawing area dimensions and the top-level element list.
 */
class Canvas {
    constructor(data) {
        _Canvas_data.set(this, void 0);
        _Canvas_elements.set(this, void 0);
        __classPrivateFieldSet(this, _Canvas_data, data, "f");
    }
    /**
     * Returns the canvas width — the `width` value of the SVG `viewBox`.
     */
    width() {
        return __classPrivateFieldGet(this, _Canvas_data, "f").width;
    }
    /**
     * Returns the canvas height — the `height` value of the SVG `viewBox`.
     */
    height() {
        return __classPrivateFieldGet(this, _Canvas_data, "f").height;
    }
    /**
     * Returns the top-level elements rendered onto the canvas, lazily wrapped
     * as {@link Element} instances on first access.
     */
    elements() {
        var _a;
        __classPrivateFieldSet(this, _Canvas_elements, (_a = __classPrivateFieldGet(this, _Canvas_elements, "f")) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _Canvas_data, "f").elements.map((el) => new Element_js_1.Element(el)), "f");
        return __classPrivateFieldGet(this, _Canvas_elements, "f");
    }
}
exports.Canvas = Canvas;
_Canvas_data = new WeakMap(), _Canvas_elements = new WeakMap();

};
M["Style/Color.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Color_data;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
/**
 * Read-only view over an entry in a style definition's `colors` block.
 */
class Color {
    constructor(data) {
        _Color_data.set(this, void 0);
        __classPrivateFieldSet(this, _Color_data, data, "f");
    }
    /**
     * Returns the candidate color values, in definition order.
     */
    values() {
        return __classPrivateFieldGet(this, _Color_data, "f").values;
    }
    /**
     * Returns the colors that the resolver should avoid picking, or an empty
     * list when the field is unset.
     */
    notEqualTo() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Color_data, "f").notEqualTo) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * Returns the name of another color that this one should contrast against,
     * or `undefined` when no contrast constraint is defined.
     */
    contrastTo() {
        return __classPrivateFieldGet(this, _Color_data, "f").contrastTo;
    }
}
exports.Color = Color;
_Color_data = new WeakMap();

};
M["Style/Component.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Component_instances, _Component_data, _Component_name, _Component_source, _Component_translate, _Component_variants, _Component_asBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const ComponentTranslate_js_1 = require("./ComponentTranslate.js");
const ComponentVariant_js_1 = require("./ComponentVariant.js");
/**
 * Read-only view over an entry in a style definition's `components` block.
 *
 * An entry is either a base component with its own dimensions and variants
 * or an alias declared via `extends`. Aliases are pure references — they
 * inherit dimensions, variants, and all transforms from the source.
 */
class Component {
    constructor(name, data, source) {
        _Component_instances.add(this);
        _Component_data.set(this, void 0);
        _Component_name.set(this, void 0);
        _Component_source.set(this, void 0);
        _Component_translate.set(this, void 0);
        _Component_variants.set(this, void 0);
        __classPrivateFieldSet(this, _Component_data, data, "f");
        __classPrivateFieldSet(this, _Component_name, name, "f");
        __classPrivateFieldSet(this, _Component_source, source, "f");
    }
    /**
     * Returns the entry's own name as declared in the style definition. For
     * aliases this is the alias key, not the source component's name (use
     * {@link sourceName} for the canonical user-option key prefix).
     */
    name() {
        return __classPrivateFieldGet(this, _Component_name, "f");
    }
    /**
     * Returns the source component name when this entry is an alias, or
     * `undefined` for a base component.
     */
    extendsName() {
        return 'extends' in __classPrivateFieldGet(this, _Component_data, "f") ? __classPrivateFieldGet(this, _Component_data, "f").extends : undefined;
    }
    /**
     * Returns the canonical user-option key prefix: the source component's
     * name when this entry is an alias, otherwise the entry's own name.
     */
    sourceName() {
        var _a;
        return (_a = this.extendsName()) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _Component_name, "f");
    }
    /**
     * Returns the component's intrinsic width in canvas coordinates. For
     * aliases the source component's width is returned.
     */
    width() {
        return __classPrivateFieldGet(this, _Component_source, "f") ? __classPrivateFieldGet(this, _Component_source, "f").width() : __classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).width;
    }
    /**
     * Returns the component's intrinsic height in canvas coordinates. For
     * aliases the source component's height is returned.
     */
    height() {
        return __classPrivateFieldGet(this, _Component_source, "f") ? __classPrivateFieldGet(this, _Component_source, "f").height() : __classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).height;
    }
    /**
     * Returns the probability (0–100) that this component is rendered.
     * Aliases delegate to the source; defaults to 100 (always visible).
     */
    probability() {
        var _a;
        if (__classPrivateFieldGet(this, _Component_source, "f")) {
            return __classPrivateFieldGet(this, _Component_source, "f").probability();
        }
        return (_a = __classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).probability) !== null && _a !== void 0 ? _a : 100;
    }
    /**
     * Returns the rotation range, or `undefined` when unset.
     * Aliases delegate to the source.
     */
    rotate() {
        return __classPrivateFieldGet(this, _Component_source, "f") ? __classPrivateFieldGet(this, _Component_source, "f").rotate() : __classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).rotate;
    }
    /**
     * Returns the scale range, or `undefined` when unset.
     * Aliases delegate to the source.
     */
    scale() {
        return __classPrivateFieldGet(this, _Component_source, "f") ? __classPrivateFieldGet(this, _Component_source, "f").scale() : __classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).scale;
    }
    /**
     * Returns the translate descriptor. Aliases delegate to the source.
     */
    translate() {
        var _a, _b;
        if (__classPrivateFieldGet(this, _Component_source, "f")) {
            return __classPrivateFieldGet(this, _Component_source, "f").translate();
        }
        __classPrivateFieldSet(this, _Component_translate, (_a = __classPrivateFieldGet(this, _Component_translate, "f")) !== null && _a !== void 0 ? _a : new ComponentTranslate_js_1.ComponentTranslate((_b = __classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).translate) !== null && _b !== void 0 ? _b : {}), "f");
        return __classPrivateFieldGet(this, _Component_translate, "f");
    }
    /**
     * Returns a name → {@link ComponentVariant} map for all defined variants.
     * Aliases delegate to the source component's variants.
     */
    variants() {
        var _a;
        if (__classPrivateFieldGet(this, _Component_source, "f")) {
            return __classPrivateFieldGet(this, _Component_source, "f").variants();
        }
        __classPrivateFieldSet(this, _Component_variants, (_a = __classPrivateFieldGet(this, _Component_variants, "f")) !== null && _a !== void 0 ? _a : new Map(Object.entries(__classPrivateFieldGet(this, _Component_instances, "m", _Component_asBase).call(this).variants).map(([name, data]) => [
            name,
            new ComponentVariant_js_1.ComponentVariant(data),
        ])), "f");
        return __classPrivateFieldGet(this, _Component_variants, "f");
    }
}
exports.Component = Component;
_Component_data = new WeakMap(), _Component_name = new WeakMap(), _Component_source = new WeakMap(), _Component_translate = new WeakMap(), _Component_variants = new WeakMap(), _Component_instances = new WeakSet(), _Component_asBase = function _Component_asBase() {
    return __classPrivateFieldGet(this, _Component_data, "f");
};

};
M["Style/ComponentTranslate.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ComponentTranslate_data;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentTranslate = void 0;
/**
 * Read-only view over a component's `translate` block, providing the X and Y
 * offset ranges.
 */
class ComponentTranslate {
    constructor(data) {
        _ComponentTranslate_data.set(this, void 0);
        __classPrivateFieldSet(this, _ComponentTranslate_data, data, "f");
    }
    x() {
        return __classPrivateFieldGet(this, _ComponentTranslate_data, "f").x;
    }
    y() {
        return __classPrivateFieldGet(this, _ComponentTranslate_data, "f").y;
    }
}
exports.ComponentTranslate = ComponentTranslate;
_ComponentTranslate_data = new WeakMap();

};
M["Style/ComponentVariant.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ComponentVariant_data, _ComponentVariant_elements;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentVariant = void 0;
const Element_js_1 = require("./Element.js");
/**
 * Read-only view over an entry in a component's `variants` block.
 */
class ComponentVariant {
    constructor(data) {
        _ComponentVariant_data.set(this, void 0);
        _ComponentVariant_elements.set(this, void 0);
        __classPrivateFieldSet(this, _ComponentVariant_data, data, "f");
    }
    /**
     * Returns the variant's elements, lazily wrapped as {@link Element}
     * instances on first access.
     */
    elements() {
        var _a;
        __classPrivateFieldSet(this, _ComponentVariant_elements, (_a = __classPrivateFieldGet(this, _ComponentVariant_elements, "f")) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _ComponentVariant_data, "f").elements.map((el) => new Element_js_1.Element(el)), "f");
        return __classPrivateFieldGet(this, _ComponentVariant_elements, "f");
    }
    /**
     * Returns the weighted-pick weight for this variant, defaulting to `1`.
     */
    weight() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _ComponentVariant_data, "f").weight) !== null && _a !== void 0 ? _a : 1;
    }
    /**
     * Returns the variant's descriptive tags (e.g. `hairLength:long`), or an
     * empty list when none are authored. Consumed by the `tags` render option
     * to filter the variant pool.
     */
    tags() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _ComponentVariant_data, "f").tags) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * Tests this variant against a single tag-filter token's grammar. With no
     * `value`, it matches a whole category: the bare `category` tag or any
     * `category:value` tag. With a `value`, it matches only the exact
     * `category:value` tag. The resolver composes these checks into the
     * allow/disallow filter structure.
     */
    hasTag(category, value) {
        if (value === undefined) {
            return this.tags().some((tag) => tag === category || tag.startsWith(`${category}:`));
        }
        return this.tags().includes(`${category}:${value}`);
    }
}
exports.ComponentVariant = ComponentVariant;
_ComponentVariant_data = new WeakMap(), _ComponentVariant_elements = new WeakMap();

};
M["Style/Element.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Element_data, _Element_children;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
/**
 * Read-only view over a single render-tree element from a style definition.
 *
 * The same node type covers SVG elements, text, and component references —
 * `type()` discriminates between them.
 */
class Element {
    constructor(data) {
        _Element_data.set(this, void 0);
        _Element_children.set(this, void 0);
        __classPrivateFieldSet(this, _Element_data, data, "f");
    }
    /**
     * Returns the element type discriminator (`svg`, `text`, `component`, …).
     */
    type() {
        return __classPrivateFieldGet(this, _Element_data, "f").type;
    }
    /**
     * Returns the element's tag/component name, or `undefined` for elements
     * that don't have one.
     */
    name() {
        return __classPrivateFieldGet(this, _Element_data, "f").name;
    }
    /**
     * Returns the element's textual value (for `text` elements) or template
     * fragment, or `undefined` when not applicable.
     */
    value() {
        return __classPrivateFieldGet(this, _Element_data, "f").value;
    }
    /**
     * Returns the element's raw attribute map, or `undefined` when no
     * attributes are defined.
     */
    attributes() {
        return __classPrivateFieldGet(this, _Element_data, "f").attributes;
    }
    /**
     * Returns the element's declarative animation timelines. Empty for
     * elements without animations.
     */
    animations() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Element_data, "f").animations) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * Returns the element's children, lazily wrapped as {@link Element}
     * instances on first access.
     */
    children() {
        var _a, _b;
        __classPrivateFieldSet(this, _Element_children, (_a = __classPrivateFieldGet(this, _Element_children, "f")) !== null && _a !== void 0 ? _a : ((_b = __classPrivateFieldGet(this, _Element_data, "f").children) !== null && _b !== void 0 ? _b : []).map((child) => new Element(child)), "f");
        return __classPrivateFieldGet(this, _Element_children, "f");
    }
}
exports.Element = Element;
_Element_data = new WeakMap(), _Element_children = new WeakMap();

};
M["Style/Meta.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Meta_data, _Meta_license, _Meta_creator, _Meta_source;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meta = void 0;
const MetaLicense_js_1 = require("./MetaLicense.js");
const MetaCreator_js_1 = require("./MetaCreator.js");
const MetaSource_js_1 = require("./MetaSource.js");
/**
 * Lazily-constructed view over a style definition's `meta` block, exposing
 * the license, creator, and source descriptors.
 */
class Meta {
    constructor(data) {
        _Meta_data.set(this, void 0);
        _Meta_license.set(this, void 0);
        _Meta_creator.set(this, void 0);
        _Meta_source.set(this, void 0);
        __classPrivateFieldSet(this, _Meta_data, data, "f");
    }
    /**
     * Returns the license descriptor, defaulting to an empty object when the
     * style definition omits the field.
     */
    license() {
        var _a, _b;
        __classPrivateFieldSet(this, _Meta_license, (_a = __classPrivateFieldGet(this, _Meta_license, "f")) !== null && _a !== void 0 ? _a : new MetaLicense_js_1.MetaLicense((_b = __classPrivateFieldGet(this, _Meta_data, "f").license) !== null && _b !== void 0 ? _b : {}), "f");
        return __classPrivateFieldGet(this, _Meta_license, "f");
    }
    /**
     * Returns the creator descriptor, defaulting to an empty object when the
     * style definition omits the field.
     */
    creator() {
        var _a, _b;
        __classPrivateFieldSet(this, _Meta_creator, (_a = __classPrivateFieldGet(this, _Meta_creator, "f")) !== null && _a !== void 0 ? _a : new MetaCreator_js_1.MetaCreator((_b = __classPrivateFieldGet(this, _Meta_data, "f").creator) !== null && _b !== void 0 ? _b : {}), "f");
        return __classPrivateFieldGet(this, _Meta_creator, "f");
    }
    /**
     * Returns the source descriptor, defaulting to an empty object when the
     * style definition omits the field.
     */
    source() {
        var _a, _b;
        __classPrivateFieldSet(this, _Meta_source, (_a = __classPrivateFieldGet(this, _Meta_source, "f")) !== null && _a !== void 0 ? _a : new MetaSource_js_1.MetaSource((_b = __classPrivateFieldGet(this, _Meta_data, "f").source) !== null && _b !== void 0 ? _b : {}), "f");
        return __classPrivateFieldGet(this, _Meta_source, "f");
    }
}
exports.Meta = Meta;
_Meta_data = new WeakMap(), _Meta_license = new WeakMap(), _Meta_creator = new WeakMap(), _Meta_source = new WeakMap();

};
M["Style/MetaCreator.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MetaCreator_data;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaCreator = void 0;
/**
 * Read-only view over the `meta.creator` block of a style definition.
 */
class MetaCreator {
    constructor(data) {
        _MetaCreator_data.set(this, void 0);
        __classPrivateFieldSet(this, _MetaCreator_data, data, "f");
    }
    /**
     * Returns the creator's display name, or `undefined` when not set.
     */
    name() {
        return __classPrivateFieldGet(this, _MetaCreator_data, "f").name;
    }
    /**
     * Returns the creator's homepage URL, or `undefined` when not set.
     */
    url() {
        return __classPrivateFieldGet(this, _MetaCreator_data, "f").url;
    }
}
exports.MetaCreator = MetaCreator;
_MetaCreator_data = new WeakMap();

};
M["Style/MetaLicense.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MetaLicense_data;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaLicense = void 0;
/**
 * Read-only view over the `meta.license` block of a style definition.
 */
class MetaLicense {
    constructor(data) {
        _MetaLicense_data.set(this, void 0);
        __classPrivateFieldSet(this, _MetaLicense_data, data, "f");
    }
    /**
     * Returns the license name (e.g. `"CC BY 4.0"`), or `undefined` when not set.
     */
    name() {
        return __classPrivateFieldGet(this, _MetaLicense_data, "f").name;
    }
    /**
     * Returns the license URL, or `undefined` when not set.
     */
    url() {
        return __classPrivateFieldGet(this, _MetaLicense_data, "f").url;
    }
    /**
     * Returns the full license text, or `undefined` when not set.
     */
    text() {
        return __classPrivateFieldGet(this, _MetaLicense_data, "f").text;
    }
}
exports.MetaLicense = MetaLicense;
_MetaLicense_data = new WeakMap();

};
M["Style/MetaSource.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MetaSource_data;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaSource = void 0;
/**
 * Read-only view over the `meta.source` block of a style definition.
 */
class MetaSource {
    constructor(data) {
        _MetaSource_data.set(this, void 0);
        __classPrivateFieldSet(this, _MetaSource_data, data, "f");
    }
    /**
     * Returns the source name (e.g. the original work title), or `undefined`
     * when not set.
     */
    name() {
        return __classPrivateFieldGet(this, _MetaSource_data, "f").name;
    }
    /**
     * Returns the URL of the source, or `undefined` when not set.
     */
    url() {
        return __classPrivateFieldGet(this, _MetaSource_data, "f").url;
    }
}
exports.MetaSource = MetaSource;
_MetaSource_data = new WeakMap();

};
M["Style.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Style_instances, _a, _Style_data, _Style_meta, _Style_canvas, _Style_components, _Style_colors, _Style_hasAnimations, _Style_animationNames, _Style_validateAliases, _Style_isAlias, _Style_validateAnimations, _Style_visitElements;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Style = void 0;
const StyleValidationError_js_1 = require("./Error/StyleValidationError.js");
const Meta_js_1 = require("./Style/Meta.js");
const Canvas_js_1 = require("./Style/Canvas.js");
const Component_js_1 = require("./Style/Component.js");
const Color_js_1 = require("./Style/Color.js");
/**
 * Validated, lazily-decomposed wrapper around a style definition. Construction
 * runs the JSON Schema validator and stores a deep clone of the input so that
 * later mutation of the source object cannot leak into the rendered avatar.
 */
class Style {
    constructor(data) {
        _Style_instances.add(this);
        _Style_data.set(this, void 0);
        _Style_meta.set(this, void 0);
        _Style_canvas.set(this, void 0);
        _Style_components.set(this, void 0);
        _Style_colors.set(this, void 0);
        _Style_hasAnimations.set(this, void 0);
        _Style_animationNames.set(this, void 0);
        __classPrivateFieldSet(this, _Style_data, structuredClone(data), "f");
        __classPrivateFieldGet(this, _Style_instances, "m", _Style_validateAliases).call(this);
        __classPrivateFieldGet(this, _Style_instances, "m", _Style_validateAnimations).call(this);
    }
    /**
     * Returns the definition's `$id`, or `undefined` when not set.
     */
    id() {
        return __classPrivateFieldGet(this, _Style_data, "f").$id;
    }
    /**
     * Returns the definition's `$schema` URI, or `undefined` when not set.
     */
    schema() {
        return __classPrivateFieldGet(this, _Style_data, "f").$schema;
    }
    /**
     * Returns the definition's `$comment`, or `undefined` when not set.
     */
    comment() {
        return __classPrivateFieldGet(this, _Style_data, "f").$comment;
    }
    /**
     * Returns the {@link Meta} view, lazily constructed on first access.
     */
    meta() {
        var _b, _c;
        __classPrivateFieldSet(this, _Style_meta, (_b = __classPrivateFieldGet(this, _Style_meta, "f")) !== null && _b !== void 0 ? _b : new Meta_js_1.Meta((_c = __classPrivateFieldGet(this, _Style_data, "f").meta) !== null && _c !== void 0 ? _c : {}), "f");
        return __classPrivateFieldGet(this, _Style_meta, "f");
    }
    /**
     * Returns a deep clone of the root SVG attributes from the definition,
     * defaulting to an empty object.
     */
    attributes() {
        var _b;
        return structuredClone((_b = __classPrivateFieldGet(this, _Style_data, "f").attributes) !== null && _b !== void 0 ? _b : {});
    }
    /**
     * Returns a deep clone of the underlying definition.
     */
    definition() {
        return structuredClone(__classPrivateFieldGet(this, _Style_data, "f"));
    }
    /**
     * Returns the {@link Canvas} view, lazily constructed on first access.
     */
    canvas() {
        var _b;
        __classPrivateFieldSet(this, _Style_canvas, (_b = __classPrivateFieldGet(this, _Style_canvas, "f")) !== null && _b !== void 0 ? _b : new Canvas_js_1.Canvas(__classPrivateFieldGet(this, _Style_data, "f").canvas), "f");
        return __classPrivateFieldGet(this, _Style_canvas, "f");
    }
    /**
     * Returns a name → {@link Component} map for all defined components, built
     * lazily on first access.
     */
    components() {
        var _b;
        if (__classPrivateFieldGet(this, _Style_components, "f")) {
            return __classPrivateFieldGet(this, _Style_components, "f");
        }
        const entries = Object.entries((_b = __classPrivateFieldGet(this, _Style_data, "f").components) !== null && _b !== void 0 ? _b : {});
        const map = new Map();
        for (const [name, data] of entries) {
            if (!__classPrivateFieldGet(_a, _a, "m", _Style_isAlias).call(_a, data)) {
                map.set(name, new Component_js_1.Component(name, data));
            }
        }
        for (const [name, data] of entries) {
            if (__classPrivateFieldGet(_a, _a, "m", _Style_isAlias).call(_a, data)) {
                map.set(name, new Component_js_1.Component(name, data, map.get(data.extends)));
            }
        }
        __classPrivateFieldSet(this, _Style_components, map, "f");
        return __classPrivateFieldGet(this, _Style_components, "f");
    }
    /**
     * Returns whether any element in the definition carries declarative
     * animations. Computed once and cached. Consumed by the options
     * descriptor to advertise the `animation` options only where they have an
     * effect.
     */
    hasAnimations() {
        if (__classPrivateFieldGet(this, _Style_hasAnimations, "f") === undefined) {
            let found = false;
            __classPrivateFieldGet(this, _Style_instances, "m", _Style_visitElements).call(this, (element) => {
                if (element.animations !== undefined && element.animations.length > 0) {
                    found = true;
                }
            });
            __classPrivateFieldSet(this, _Style_hasAnimations, found, "f");
        }
        return __classPrivateFieldGet(this, _Style_hasAnimations, "f");
    }
    /**
     * Returns the sorted distinct names of the definition's animation
     * timelines. Computed once and cached. Consumed by the options descriptor
     * so tooling can offer a switch, a speed and a delay per animation name.
     * Sorted so every port reports the same order regardless of how it walks
     * the definition.
     */
    animationNames() {
        if (__classPrivateFieldGet(this, _Style_animationNames, "f") === undefined) {
            const names = new Set();
            __classPrivateFieldGet(this, _Style_instances, "m", _Style_visitElements).call(this, (element) => {
                var _b;
                for (const animation of (_b = element.animations) !== null && _b !== void 0 ? _b : []) {
                    if (animation.name !== undefined) {
                        names.add(animation.name);
                    }
                }
            });
            __classPrivateFieldSet(this, _Style_animationNames, Array.from(names).sort(), "f");
        }
        return __classPrivateFieldGet(this, _Style_animationNames, "f");
    }
    /**
     * Returns a name → {@link Color} map for all defined colors, built lazily
     * on first access.
     */
    colors() {
        var _b, _c;
        __classPrivateFieldSet(this, _Style_colors, (_b = __classPrivateFieldGet(this, _Style_colors, "f")) !== null && _b !== void 0 ? _b : new Map(Object.entries((_c = __classPrivateFieldGet(this, _Style_data, "f").colors) !== null && _c !== void 0 ? _c : {}).map(([name, data]) => [
            name,
            new Color_js_1.Color(data),
        ])), "f");
        return __classPrivateFieldGet(this, _Style_colors, "f");
    }
}
exports.Style = Style;
_a = Style, _Style_data = new WeakMap(), _Style_meta = new WeakMap(), _Style_canvas = new WeakMap(), _Style_components = new WeakMap(), _Style_colors = new WeakMap(), _Style_hasAnimations = new WeakMap(), _Style_animationNames = new WeakMap(), _Style_instances = new WeakSet(), _Style_validateAliases = function _Style_validateAliases() {
    const components = __classPrivateFieldGet(this, _Style_data, "f").components;
    if (!components) {
        return;
    }
    const errors = [];
    for (const [name, data] of Object.entries(components)) {
        if (!__classPrivateFieldGet(_a, _a, "m", _Style_isAlias).call(_a, data)) {
            continue;
        }
        const target = data.extends;
        const targetData = components[target];
        if (!targetData) {
            errors.push({
                instancePath: `/components/${name}/extends`,
                message: `references unknown component "${target}"`,
            });
            continue;
        }
        if (__classPrivateFieldGet(_a, _a, "m", _Style_isAlias).call(_a, targetData)) {
            errors.push({
                instancePath: `/components/${name}/extends`,
                message: `references alias "${target}" — alias chains are not allowed`,
            });
        }
    }
    if (errors.length > 0) {
        throw new StyleValidationError_js_1.StyleValidationError(errors);
    }
}, _Style_isAlias = function _Style_isAlias(data) {
    return 'extends' in data;
}, _Style_validateAnimations = function _Style_validateAnimations() {
    const errors = [];
    __classPrivateFieldGet(this, _Style_instances, "m", _Style_visitElements).call(this, (element, path) => {
        var _b;
        (_b = element.animations) === null || _b === void 0 ? void 0 : _b.forEach((animation, animationIndex) => {
            for (const [trackName, track] of Object.entries(animation.tracks)) {
                const keyframes = track.keyframes;
                for (let i = 1; i < keyframes.length; i++) {
                    if (keyframes[i].at <= keyframes[i - 1].at) {
                        errors.push({
                            instancePath: `${path}/animations/${animationIndex}/tracks/${trackName}/keyframes/${i}/at`,
                            message: 'must be greater than the previous keyframe',
                        });
                    }
                }
            }
        });
    });
    if (errors.length > 0) {
        throw new StyleValidationError_js_1.StyleValidationError(errors);
    }
}, _Style_visitElements = function _Style_visitElements(visit) {
    var _b;
    const walk = (elements, path) => {
        elements.forEach((element, index) => {
            const elementPath = `${path}/${index}`;
            visit(element, elementPath);
            if (element.children) {
                walk(element.children, `${elementPath}/children`);
            }
        });
    };
    walk(__classPrivateFieldGet(this, _Style_data, "f").canvas.elements, '/canvas/elements');
    for (const [name, component] of Object.entries((_b = __classPrivateFieldGet(this, _Style_data, "f").components) !== null && _b !== void 0 ? _b : {})) {
        if (__classPrivateFieldGet(_a, _a, "m", _Style_isAlias).call(_a, component)) {
            continue;
        }
        for (const [variantName, variant] of Object.entries(component.variants)) {
            walk(variant.elements, `/components/${name}/variants/${variantName}/elements`);
        }
    }
};

};
M["StyleDefinition.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

};
M["StyleOptions.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLOR_ORDER_FIXED = exports.COLOR_ORDER_RANDOM = void 0;
exports.COLOR_ORDER_RANDOM = 'random';
exports.COLOR_ORDER_FIXED = 'fixed';

};
M["Utils/Color.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Color_LINEARIZED, _Color_linearize;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
/**
 * Color helpers used by the renderer and option resolver.
 */
class Color {
    /**
     * Normalizes any hex format to 6- or 8-digit lowercase with `#` prefix.
     */
    static toHex(hex) {
        const h = hex.replace(/^#/, '').toLowerCase();
        if (h.length === 3) {
            return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        if (h.length === 4) {
            return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
        }
        return '#' + h;
    }
    /**
     * Like {@link toHex}, but strips the alpha channel and always returns
     * 6-digit hex.
     */
    static toRgbHex(hex) {
        const h = this.toHex(hex);
        return h.length > 7 ? h.slice(0, 7) : h;
    }
    /**
     * Parses a hex color into an `[r, g, b]` triple of 8-bit channel values.
     */
    static parseHex(hex) {
        const h = this.toHex(hex).slice(1);
        return [
            parseInt(h.slice(0, 2), 16),
            parseInt(h.slice(2, 4), 16),
            parseInt(h.slice(4, 6), 16),
        ];
    }
    /**
     * WCAG 2.1 relative luminance with sRGB linearization.
     *
     * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
     */
    static luminance(hex) {
        const rgb = this.parseHex(hex);
        const linearR = __classPrivateFieldGet(this, _a, "m", _Color_linearize).call(this, rgb[0]);
        const linearG = __classPrivateFieldGet(this, _a, "m", _Color_linearize).call(this, rgb[1]);
        const linearB = __classPrivateFieldGet(this, _a, "m", _Color_linearize).call(this, rgb[2]);
        return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
    }
    /**
     * Returns a new array sorted by descending contrast against the reference
     * color.
     *
     * @see https://www.w3.org/WAI/GL/wiki/Contrast_ratio
     */
    static sortByContrast(candidates, refColor) {
        const refLum = this.luminance(refColor);
        const withRatio = candidates.map((c) => {
            const lum = this.luminance(c);
            const ratio = (Math.max(lum, refLum) + 0.05) / (Math.min(lum, refLum) + 0.05);
            return { color: c, ratio };
        });
        withRatio.sort((a, b) => b.ratio - a.ratio);
        return withRatio.map((e) => e.color);
    }
    /**
     * Returns a new array with excluded colors removed. Falls back to the
     * original candidates when filtering would empty the list.
     */
    static filterNotEqualTo(candidates, excluded) {
        const normalized = new Set(excluded.map((c) => this.toRgbHex(c)));
        const filtered = candidates.filter((c) => !normalized.has(this.toRgbHex(c)));
        return filtered.length > 0 ? filtered : Array.from(candidates);
    }
}
exports.Color = Color;
_a = Color, _Color_linearize = function _Color_linearize(channel) {
    return __classPrivateFieldGet(_a, _a, "f", _Color_LINEARIZED)[channel];
};
/**
 * Linear-light value for every 8-bit sRGB channel value, precomputed from
 * `s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4` with
 * `s = channel / 255`.
 *
 * A lookup table because `**` (`Math.pow`) is not required to be correctly
 * rounded: results differ between JS engines and the math libraries used by
 * the other language ports, which would break cross-language byte parity.
 */
_Color_LINEARIZED = { value: [
        0.0, 0.0003035269835488375, 0.000607053967097675, 0.0009105809506465125,
        0.00121410793419535, 0.0015176349177441874, 0.001821161901293025,
        0.0021246888848418626, 0.0024282158683907, 0.0027317428519395373,
        0.003035269835488375, 0.003346535763899161, 0.003676507324047436,
        0.004024717018496307, 0.004391442037410293, 0.004776953480693729,
        0.005181516702338386, 0.005605391624202723, 0.006048833022857055,
        0.006512090792594474, 0.006995410187265387, 0.007499032043226175,
        0.008023192985384994, 0.008568125618069307, 0.009134058702220787,
        0.009721217320237847, 0.010329823029626938, 0.010960094006488246,
        0.011612245179743887, 0.012286488356915872, 0.012983032342173012,
        0.013702083047289686, 0.014443843596092545, 0.01520851442291271,
        0.01599629336550963, 0.016807375752887384, 0.017641954488384078,
        0.018500220128379697, 0.019382360956935723, 0.0202885630566524,
        0.021219010376003558, 0.02217388479338738, 0.02315336617811041,
        0.024157632448504756, 0.025186859627361627, 0.026241221894849898,
        0.027320891639074897, 0.028426039504420793, 0.0295568344378088,
        0.030713443732993635, 0.03189603307301153, 0.033104766570885055,
        0.03433980680868217, 0.03560131487502034, 0.03688945040110004,
        0.0382043715953465, 0.03954623527673283, 0.04091519690685319,
        0.042311410620809675, 0.043735029256973465, 0.04518620438567554,
        0.0466650863368801, 0.048171824226889426, 0.04970656598412723,
        0.05126945837404324, 0.052860647023180246, 0.05448027644244237,
        0.05612849004960009, 0.05780543019106723, 0.0595112381629812,
        0.06124605423161761, 0.06301001765316767, 0.06480326669290577,
        0.06662593864377289, 0.06847816984440017, 0.07036009569659588,
        0.07227185068231748, 0.07421356838014963, 0.07618538148130785,
        0.07818742180518633, 0.08021982031446831, 0.0822827071298148,
        0.08437621154414882, 0.08650046203654976, 0.08865558628577294,
        0.09084171118340767, 0.09305896284668747, 0.0953074666309647,
        0.09758734714186246, 0.09989872824711389, 0.1022417330881013,
        0.10461648409110419, 0.10702310297826761, 0.10946171077829933,
        0.1119324278369056, 0.11443537382697373, 0.11697066775851084,
        0.11953842798834562, 0.12213877222960187, 0.12477181756095049,
        0.12743768043564743, 0.1301364766903643, 0.13286832155381798,
        0.13563332965520566, 0.13843161503245183, 0.14126329114027164,
        0.14412847085805777, 0.14702726649759498, 0.14995978981060856,
        0.15292615199615017, 0.1559264637078274, 0.1589608350608804,
        0.16202937563911096, 0.1651321945016676, 0.16826940018969075,
        0.1714411007328226, 0.17464740365558504, 0.17788841598362914,
        0.18116424424986022, 0.184474994500441, 0.18782077230067787,
        0.1912016827407914, 0.19461783044157582, 0.19806931955994886,
        0.20155625379439707, 0.20507873639031693, 0.20863687014525575,
        0.21223075741405523, 0.21586050011389923, 0.21952619972926923,
        0.2232279573168085, 0.22696587351009836, 0.23074004852434915,
        0.23455058216100522, 0.238397573812271, 0.24228112246555486,
        0.24620132670783548, 0.25015828472995344, 0.25415209433082675,
        0.2581828529215958, 0.26225065752969623, 0.26635560480286247,
        0.2704977910130658, 0.27467731206038465, 0.2788942634768104,
        0.2831487404299921, 0.2874408377269175, 0.29177064981753587,
        0.2961382707983211, 0.3005437944157765, 0.3049873140698863,
        0.30946892281750854, 0.31398871337571754, 0.31854677812509186,
        0.32314320911295075, 0.3277780980565422, 0.33245153634617935,
        0.33716361504833037, 0.341914424908661, 0.3467040563550296,
        0.35153259950043936, 0.3564001441459435, 0.3613067797835095,
        0.3662525955988395, 0.3712376804741491, 0.37626212299090644,
        0.3813260114325301, 0.386429433787049, 0.39157247774972326,
        0.39675523072562685, 0.40197777983219574, 0.4072402119017367,
        0.41254261348390375, 0.4178850708481375, 0.4232676699860717,
        0.4286904966139067, 0.4341536361747489, 0.4396571738409188,
        0.44520119451622786, 0.45078578283822346, 0.45641102318040466,
        0.4620769996544071, 0.467783796112159, 0.47353149614800955,
        0.4793201831008268, 0.4851499400560704, 0.4910208498478356,
        0.4969329950608704, 0.5028864580325687, 0.5088813208549338,
        0.5149176653765214, 0.5209955732043543, 0.5271151257058131,
        0.5332764040105052, 0.5394794890121071, 0.5457244613701866,
        0.5520114015120001, 0.5583403896342679, 0.5647115057049292,
        0.5711248294648731, 0.5775804404296506, 0.5840784178911641,
        0.5906188409193369, 0.5972017883637634, 0.6038273388553378,
        0.6104955708078648, 0.6172065624196511, 0.6239603916750761,
        0.6307571363461468, 0.6375968739940326, 0.6444796819705821,
        0.6514056374198242, 0.6583748172794486, 0.665387298282272,
        0.6724431569576875, 0.6795424696330938, 0.6866853124353134,
        0.6938717612919899, 0.7011018919329731, 0.7083757798916868,
        0.7156935005064807, 0.7230551289219693, 0.7304607400903537,
        0.7379104087727308, 0.7454042095403874, 0.7529422167760779,
        0.7605245046752924, 0.7681511472475071, 0.7758222183174236,
        0.7835377915261935, 0.7912979403326302, 0.799102738014409,
        0.8069522576692516, 0.8148465722161012, 0.8227857543962835,
        0.8307698767746546, 0.83879901174074, 0.846873231509858, 0.8549926081242338,
        0.8631572134541023, 0.8713671191987973, 0.8796223968878317,
        0.8879231178819663, 0.8962693533742664, 0.9046611743911496,
        0.9130986517934192, 0.9215818562772946, 0.9301108583754237,
        0.938685728457888, 0.9473065367331999, 0.9559733532492861,
        0.9646862478944651, 0.9734452903984125, 0.9822505503331171,
        0.9911020971138298, 1,
    ] };

};
M["Utils/Initials.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initials = void 0;
/**
 * Derives display initials from a seed string.
 *
 * @see https://www.regular-expressions.info/unicode.html
 */
class Initials {
    /**
     * Returns one or two uppercase initials for the given seed. By default
     * strips `@...` so email addresses yield a single initial instead of being
     * treated as two words.
     */
    static fromSeed(seed, discardAtSymbol = true) {
        let input = seed;
        if (discardAtSymbol) {
            // Strip the whole @ suffix, including any line terminators (dotall `s`).
            input = seed.replace(/@.*/s, '');
        }
        input = input.replace(/[`´'ʼ]/g, '');
        const matches = input.match(/(\p{L}[\p{L}\p{M}]*)/gu);
        if (!matches) {
            return discardAtSymbol ? this.fromSeed(seed, false) : '';
        }
        if (matches.length === 1) {
            const match = matches[0].match(/^(?:\p{L}\p{M}*){1,2}/u);
            return match ? match[0].toUpperCase() : '';
        }
        const first = matches[0].match(/^(?:\p{L}\p{M}*)/u);
        const last = matches[matches.length - 1].match(/^(?:\p{L}\p{M}*)/u);
        if (!first || !last) {
            return '';
        }
        return (first[0] + last[0]).toUpperCase();
    }
}
exports.Initials = Initials;

};
M["Utils/License.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.License = void 0;
const Xml_js_1 = require("./Xml.js");
/**
 * Builds attribution strings and embedded RDF/Dublin Core metadata from a
 * style's {@link Meta} block.
 */
class License {
    /**
     * Returns a single-line attribution string suitable for `<title>` or
     * `<desc>` content. Returns an empty string when no attribution data is
     * available.
     */
    static text(meta) {
        const sourceName = meta.source().name();
        const sourceUrl = meta.source().url();
        const creatorName = meta.creator().name();
        const licenseName = meta.license().name();
        const licenseUrl = meta.license().url();
        if (!sourceName && !creatorName && !licenseName) {
            return '';
        }
        let title = sourceName ? `“${sourceName}”` : 'Design';
        if (sourceUrl) {
            title += ` (${sourceUrl})`;
        }
        const creator = `“${creatorName !== null && creatorName !== void 0 ? creatorName : 'Unknown'}”`;
        let result = '';
        // Skip "Remix of" prefix for MIT-licensed or DiceBear-original styles.
        if (licenseName !== 'MIT' && creatorName !== 'DiceBear' && sourceName) {
            result += 'Remix of ';
        }
        result += `${title} by ${creator}`;
        if (licenseName) {
            result += `, licensed under “${licenseName}”`;
            if (licenseUrl) {
                result += ` (${licenseUrl})`;
            }
        }
        return result;
    }
    /**
     * Builds an embedded `<metadata>` block with Dublin Core terms describing
     * the style's source, creator, license, and rights statement. Returns an
     * empty string when no metadata fields are populated.
     */
    static xml(meta) {
        const title = meta.source().name();
        const creatorName = meta.creator().name();
        const sourceUrl = meta.source().url();
        const licenseUrl = meta.license().url();
        const rights = this.text(meta);
        if (!title && !creatorName && !sourceUrl && !licenseUrl && !rights) {
            return '';
        }
        const fields = [];
        if (title) {
            fields.push(`<dc:title>${Xml_js_1.Xml.escape(title)}</dc:title>`);
        }
        if (creatorName) {
            fields.push(`<dc:creator>${Xml_js_1.Xml.escape(creatorName)}</dc:creator>`);
        }
        if (sourceUrl) {
            fields.push(`<dc:source xsi:type="dcterms:URI">${Xml_js_1.Xml.escape(sourceUrl)}</dc:source>`);
        }
        if (licenseUrl) {
            fields.push(`<dcterms:license xsi:type="dcterms:URI">${Xml_js_1.Xml.escape(licenseUrl)}</dcterms:license>`);
        }
        if (rights) {
            fields.push(`<dc:rights>${Xml_js_1.Xml.escape(rights)}</dc:rights>`);
        }
        return ('<metadata' +
            ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
            ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
            ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
            ' xmlns:dcterms="http://purl.org/dc/terms/">' +
            `<rdf:RDF><rdf:Description>${fields.join('')}</rdf:Description></rdf:RDF>` +
            '</metadata>');
    }
}
exports.License = License;

};
M["Utils/Number.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Number = void 0;
/**
 * Formats a number for SVG output, rounded to at most 5 decimal places.
 *
 * Rounding to a fixed precision keeps the output bounded and identical across
 * every port: every value becomes a multiple of 1e-5 in the SVG coordinate
 * range, which has no exponential form, so the result is built from integer
 * arithmetic (no locale- or language-specific float stringifying). Five
 * decimals is far below sub-pixel precision for any realistic canvas.
 */
class Number {
    static format(value) {
        // `value !== value` and the Infinity literals avoid referencing the global
        // `Number`, which this class shadows within the module.
        if (value !== value) {
            return 'NaN';
        }
        if (value === Infinity) {
            return 'Infinity';
        }
        if (value === -Infinity) {
            return '-Infinity';
        }
        let scaled = Math.round(value * 100000);
        const sign = scaled < 0 ? '-' : '';
        scaled = Math.abs(scaled);
        const integerPart = Math.floor(scaled / 100000);
        const fraction = String(scaled % 100000)
            .padStart(5, '0')
            .replace(/0+$/, '');
        return `${sign}${integerPart}${fraction ? `.${fraction}` : ''}`;
    }
}
exports.Number = Number;

};
M["Utils/Xml.js"] = function (module, exports, require) {
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Xml_entities, _Xml_pattern;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xml = void 0;
/**
 * Minimal XML escaping helper for SVG/XML text and attribute content.
 */
class Xml {
    /**
     * Returns `value` with the five XML predefined entities escaped.
     */
    static escape(value) {
        return value.replace(__classPrivateFieldGet(_a, _a, "f", _Xml_pattern), (ch) => __classPrivateFieldGet(_a, _a, "f", _Xml_entities)[ch]);
    }
}
exports.Xml = Xml;
_a = Xml;
_Xml_entities = { value: {
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
    } };
_Xml_pattern = { value: new RegExp(`[${Object.keys(__classPrivateFieldGet(_a, _a, "f", _Xml_entities)).join('')}]`, 'g') };

};
M["lite.js"] = function (module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsDescriptor = exports.Avatar = exports.Style = void 0;
// The same API as the package root, without the schema validators. A
// bundle that imports this entry leaves the two compiled validators out,
// which is about half of the library. Use it when the style definitions and
// the options come from your own code, and stay on the root entry when
// either arrives from outside.
var Style_js_1 = require("./Style.js");
Object.defineProperty(exports, "Style", { enumerable: true, get: function () { return Style_js_1.Style; } });
var Avatar_js_1 = require("./Avatar.js");
Object.defineProperty(exports, "Avatar", { enumerable: true, get: function () { return Avatar_js_1.Avatar; } });
var OptionsDescriptor_js_1 = require("./OptionsDescriptor.js");
Object.defineProperty(exports, "OptionsDescriptor", { enumerable: true, get: function () { return OptionsDescriptor_js_1.OptionsDescriptor; } });

};
function norm(base, rel) { var parts = base.split('/'); parts.pop(); rel.split('/').forEach(function (s) { if (s === '..') parts.pop(); else if (s !== '.') parts.push(s); }); return parts.join('/'); }
function req(from) { return function (r) { var id = norm(from, r); if (C[id]) return C[id].exports; var m = C[id] = { exports: {} }; M[id](m, m.exports, req(id)); return m.exports; }; }
window.DiceBear = req('index.js')('./lite.js');
})();
