import React, { useState } from 'react'
const DashboardComponent = React.lazy(() => import('../components/Dashboard'))
const TransactionModule = React.lazy(() => import('../components/TransactionModule'))
const Sidebar = React.lazy(() => import('../components/Sidebar'))

export function DashboardPage() {
    const [activeModule, setActiveModule] = useState('dashboard');
    
    return (
        <>
            {/* Layout: sidebar + main content */}
            <div className="flex min-h-screen">
              <React.Suspense fallback={null}>
                <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
              </React.Suspense>

              <main className="flex-1 ml-56 w-full">
                {activeModule === 'dashboard' && (
                  <React.Suspense fallback={<div className="text-white text-center p-10">Loading dashboard...</div>}>
                    <DashboardComponent />
                  </React.Suspense>
                )}
                {activeModule === 'income' && (
                  <React.Suspense fallback={<div className="text-white text-center p-10">Loading income...</div>}>
                    <TransactionModule moduleType="income" />
                  </React.Suspense>
                )}
                {activeModule === 'expense' && (
                  <React.Suspense fallback={<div className="text-white text-center p-10">Loading expenses...</div>}>
                    <TransactionModule moduleType="expense" />
                  </React.Suspense>
                )}
              </main>
            </div>
        </>
    );
}

export default DashboardPage;
