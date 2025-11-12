import React,{useState , useEffect} from 'react'
import RecordHeader from '../components/RecoedHeader'
import AddNewTransection from '../components/AddNewTransection'
const RecordList = React.lazy(() => import('../components/RecordList'))
const TransactionSummary  = React.lazy(()=> import('../components/TransactionSummary'))
const AIChatBot = React.lazy(()=> import ('../components/AIChatBot'))


export function SeeRecord() {
    const [Adding, setAdding] = useState(false);
    const [transactionChanged, setTransactionChanged] = useState(false);
        const [activeModule, setActiveModule] = useState('dashboard');
    
    return (
        <>
                        <RecordHeader Adding={Adding} setAdding={setAdding} />
                        {/* Layout: sidebar + main content */}
                        <div className="flex">

                            <main className="flex-1 p-4">
            {/* <TransactionSummary transactionChanged={transactionChanged} /> */}
                                <RecordList
                                    Adding={Adding}
                                    setAdding={setAdding}
                                    transactionChanged={transactionChanged}
                                    setTransactionChanged={setTransactionChanged}
                                    moduleFilter={activeModule}
                                />

                                <div className={`${Adding ?  'visible' : 'hidden'}`}>
                                        <AddNewTransection Adding={Adding} setAdding={setAdding} setTransactionChanged={setTransactionChanged} />
                                </div>

                                {/* AI Chatbot Component */}
                                <React.Suspense fallback={null}>
                                    <AIChatBot />
                                </React.Suspense>
                            </main>
                        </div>
        </>
    );
}

