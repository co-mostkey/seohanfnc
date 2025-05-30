/// <reference types="react" />
/// <reference types="react-dom" />

import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements extends React.JSX.IntrinsicElements { }
    }
}

export { }; 