import React,{useState , useEffect} from 'react'
import RecordHeader from '../componant/RecoedHeader'
import AddNewTransection from '../componant/AddNewTransection'
const RecordList = React.lazy(() => import('../componant/RecordList'))
const TransactionSummary  = React.lazy(()=> import('../componant/TransactionSummary'))
const AIChatBot = React.lazy(()=> import ('../componant/AIChatBot'))

export function SeeRecord() {
    const [Adding, setAdding] = useState(false);
    const [transactionChanged, setTransactionChanged] = useState(false);
    
    return (
        <>
            <RecordHeader Adding={Adding} setAdding={setAdding} />
            {/* <TransactionSummary transactionChanged={transactionChanged} /> */}

            <RecordList Adding={Adding} setAdding={setAdding} transactionChanged={transactionChanged} setTransactionChanged={setTransactionChanged}/>

            <div className={`${Adding ?  'visible' : 'hidden'}`}>
                <AddNewTransection Adding={Adding} setAdding={setAdding} setTransactionChanged={setTransactionChanged} />
            </div>

            {/* AI Chatbot Component */}
            <AIChatBot />
        </>
    );
}

