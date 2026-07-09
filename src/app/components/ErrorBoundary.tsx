import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('组件错误:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">页面加载出错</h1>
                <p className="text-sm text-gray-600 mt-1">
                  抱歉，当前页面遇到了一些问题
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-900 mb-2">错误信息:</div>
                <div className="text-sm text-red-600 font-mono bg-white rounded p-3 border border-red-200 overflow-x-auto">
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-2">建议操作:</div>
              <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                <li>点击下方按钮刷新页面</li>
                <li>检查网络连接是否正常</li>
                <li>清除浏览器缓存后重试</li>
                <li>使用 Chrome、Edge 或 Safari 最新版本</li>
                <li>如问题持续，请联系技术支持</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                刷新页面
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                返回上页
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                  查看详细堆栈信息 (开发模式)
                </summary>
                <pre className="mt-2 text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
