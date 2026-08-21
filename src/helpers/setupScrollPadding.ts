import React, { ComponentType } from "react";
import { FlatList as RNFlatList, ScrollView as RNScrollView } from "react-native";
import { FlatList as GHFlatList, ScrollView as GHScrollView } from "react-native-gesture-handler";

const DEFAULT_BOTTOM_PADDING = 24;

type TargetComponentType = ComponentType<any> & {
    type?: ComponentType<any>;
};

function isTargetComponent(type: any): boolean {
    if (!type) return false;
    return (
        type === RNScrollView ||
        type === RNFlatList ||
        type === GHScrollView ||
        type === GHFlatList ||
        (type.type && (
            type.type === RNScrollView ||
            type.type === RNFlatList ||
            type.type === GHScrollView ||
            type.type === GHFlatList
        ))
    );
}

function patchProps(props: any): Record<string, any> {
    if (!props) return { contentContainerStyle: { paddingBottom: DEFAULT_BOTTOM_PADDING } };
    const existingStyle = props.contentContainerStyle;
    const patchedStyle = existingStyle
        ? Array.isArray(existingStyle)
            ? [{ paddingBottom: DEFAULT_BOTTOM_PADDING }, ...existingStyle]
            : [{ paddingBottom: DEFAULT_BOTTOM_PADDING }, existingStyle]
        : { paddingBottom: DEFAULT_BOTTOM_PADDING };

    return {
        ...props,
        contentContainerStyle: patchedStyle,
    };
}

// 1. Patch React.createElement
const originalCreateElement = React.createElement;
(React as any).createElement = function (type: any, props: any, ...children: any[]) {
    if (isTargetComponent(type)) {
        props = patchProps(props);
    }
    return originalCreateElement.call(this, type, props, ...children);
};

// 2. Patch JSX runtime if loaded
try {
    const jsxRuntime = require("react/jsx-runtime");
    if (jsxRuntime && jsxRuntime.jsx) {
        const originalJsx = jsxRuntime.jsx;
        jsxRuntime.jsx = function (type: any, props: any, key: any) {
            if (isTargetComponent(type)) {
                props = patchProps(props);
            }
            return originalJsx.call(this, type, props, key);
        };
    }
    if (jsxRuntime && jsxRuntime.jsxs) {
        const originalJsxs = jsxRuntime.jsxs;
        jsxRuntime.jsxs = function (type: any, props: any, key: any) {
            if (isTargetComponent(type)) {
                props = patchProps(props);
            }
            return originalJsxs.call(this, type, props, key);
        };
    }
} catch (e) {
    // jsx-runtime optional fallback
}

try {
    const jsxDevRuntime = require("react/jsx-dev-runtime");
    if (jsxDevRuntime && jsxDevRuntime.jsxDEV) {
        const originalJsxDEV = jsxDevRuntime.jsxDEV;
        jsxDevRuntime.jsxDEV = function (type: any, props: any, key: any, isStaticChildren: boolean, source: any, self: any) {
            if (isTargetComponent(type)) {
                props = patchProps(props);
            }
            return originalJsxDEV.call(this, type, props, key, isStaticChildren, source, self);
        };
    }
} catch (e) {
    // jsx-dev-runtime optional fallback
}
