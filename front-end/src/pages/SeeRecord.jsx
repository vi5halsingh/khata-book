import React,{useState , useEffect} from 'react'
import RecordHeader from '../componant/RecoedHeader'
import RecordList from '../componant/RecordList'
import AddNewTransection from '../componant/AddNewTransection'
import TransactionSummary from '../componant/TransactionSummary'

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
        </>
    );
}

