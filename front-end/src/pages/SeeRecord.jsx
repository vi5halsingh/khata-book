import React,{useState , useEffect} from 'react'
import RecordHeader from '../componant/RecoedHeader'
import RecordList from '../componant/RecordList'
import AddNewTransection from '../componant/AddNewTransection'


export function SeeRecord() {
    const [Adding, setAdding] = useState(false);
    // console.log(Adding);
    
    return (
        <>
            <RecordHeader Adding={Adding} setAdding={setAdding} />
            <RecordList  Adding={Adding} setAdding={setAdding}  />
            <div className={`${Adding ?  'visible' : 'hidden'}`}>
                <AddNewTransection Adding = { Adding} setAdding = { setAdding} />
            </div>
        </>
    );
}

