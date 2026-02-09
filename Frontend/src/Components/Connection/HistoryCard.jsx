import React, { useEffect } from 'react'
import { useConnection } from '../../Context/ConnectionContext';
import { useParams } from 'react-router-dom';
import CustomerCardSecond from '../Dashboard/CustomerCardSecond';
import { formatDate } from '../../Services/dateFormat';

function HistoryCard() {
      const { getConnection, connectionData,getConnectionById,singleConnectionData, setSingleConnectionData } = useConnection();
  const { cid, id } = useParams();
  useEffect(() => {
    getConnectionById(cid)
  }, []);
  const abc= singleConnectionData?.history?.reverse()
  
  
  return (
    <section className=' flex flex-col gap-6' >
      <h2 className='text-2xl'>Customer Profile</h2>
      <CustomerCardSecond information={singleConnectionData?.customer}/>
      <h2 className='text-2xl'>Current Status</h2>
      <div className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl items-start flex flex-col gap-3">
        <div className="border px-3 rounded-md">{singleConnectionData?.status}</div>
        <div className="">
          <div className="text-xl">{singleConnectionData?.bandwidth}Mbps</div>
        <div className="font-semibold text-[#363636]">{singleConnectionData?.serviceType} / {singleConnectionData?.technicalDetails?.telcoProvider}</div>

        </div>

        <div className="flex justify-between w-full">
          <div className=" flex-1 flex flex-col items-start">
            <div className="">A End : {singleConnectionData?.technicalDetails?.aEnd?.btsId}</div>
            <div className="border text-sm px-2 rounded-md">{singleConnectionData?.technicalDetails?.aEnd?.address}</div>
          </div>
          <div className=" flex-1 flex flex-col items-start">
            <div className="">B End : {singleConnectionData?.technicalDetails?.bEnd?.btsId}</div>
            <div className="border text-sm px-2 rounded-md">{singleConnectionData?.technicalDetails?.bEnd?.address}</div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between"><span>mrc</span><span>{singleConnectionData?.commercials?.mrc}</span></div>
          <div className="flex justify-between"><span>Rate per Mb</span><span>{singleConnectionData?.commercials?.ratePerMb}</span></div>
          <div className="flex justify-between"><span>One time Charge</span><span>{singleConnectionData?.commercials?.otc}</span></div>
          <div className="flex justify-between"><span>Advance</span><span>{singleConnectionData?.commercials?.advance}</span></div>
        </div>

        {
        singleConnectionData?.status == "Notice Period" &&
         <div className="w-full">
          <div className="flex justify-between"><span>Final date</span><span>{formatDate( singleConnectionData?.terminationDetails?.finalDate)}</span></div>
          <div className="flex justify-between"><span>Raise date</span><span>{formatDate(singleConnectionData?.terminationDetails?.raiseDate)}</span></div>
          <div className="flex justify-between"><span>Reason</span><span>{singleConnectionData?.terminationDetails?.reason}</span></div>
        </div>}


        
      </div>
      <h2 className='text-2xl'>Connection History</h2>

      {singleConnectionData?.history?.map((e,i)=>{
        return (<>
<div key={i} className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl items-start flex flex-col gap-3">
        <div className="">
        <div className="border px-3 rounded-md">{e?.action}</div>
        <div className="">{formatDate(e?.date)}</div>


        </div>
        <div className="">
          <div className="text-xl">{e?.bandwidth}Mbps</div>
        <div className="font-semibold text-[#363636]">{e?.serviceType} / {e?.technicalDetails?.telcoProvider}</div>

        </div>

        <div className="flex justify-between w-full">
          <div className=" flex-1 flex flex-col items-start">
            <div className="">A End : {e?.technicalDetails?.aEnd?.btsId}</div>
            <div className="border text-sm px-2 rounded-md">{e?.technicalDetails?.aEnd?.address}</div>
          </div>
          <div className=" flex-1 flex flex-col items-start">
            <div className="">B End : {e?.technicalDetails?.bEnd?.btsId}</div>
            <div className="border text-sm px-2 rounded-md">{e?.technicalDetails?.bEnd?.address}</div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between"><span>mrc</span><span>{e?.commercials?.mrc}</span></div>
          <div className="flex justify-between"><span>Rate per Mb</span><span>{e?.commercials?.ratePerMb}</span></div>
          <div className="flex justify-between"><span>One time Charge</span><span>{e?.commercials?.otc}</span></div>
          <div className="flex justify-between"><span>Advance</span><span>{e?.commercials?.advance}</span></div>
        </div>

        {
        singleConnectionData.status == "Notice Period" &&
         <div className="w-full">
          <div className="flex justify-between"><span>Final date</span><span>{formatDate( e?.terminationDetails?.finalDate)}</span></div>
          <div className="flex justify-between"><span>Raise date</span><span>{formatDate(e?.terminationDetails?.raiseDate)}</span></div>
          <div className="flex justify-between"><span>Reason</span><span>{e?.terminationDetails?.reason}</span></div>
        </div>}


        
      </div>
        </>)
      })}



        
    </section>
  )
}

export default HistoryCard