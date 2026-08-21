import React, { Component } from 'react';
import { Html } from '@react-three/drei';

export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="bg-red-900/80 p-6 rounded text-white border border-red-500 w-[500px]">
            <h2 className="text-xl font-bold mb-2">3D Scene Crashed</h2>
            <pre className="text-xs whitespace-pre-wrap">{this.state.error?.toString()}</pre>
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}
