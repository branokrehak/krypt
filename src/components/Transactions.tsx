import React, { useContext } from 'react';

import { TransactionContext } from '../context/TransactionContext';
import dummyData from '../utils/dummy-data';
import { shortenAdress } from '../utils/shorten-address';
import useFetch from '../hooks/useFetch';

const TransationCard = ({ addressTo, addressFrom, timestamp, message, keyword, url, amount }: { addressTo: string, addressFrom: string, timestamp: string, message: string, keyword: string, url: string, amount: string }) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      flex-col p-3 rounded-md hover:shadow-2xl
    ">
      <div className="flex flex-col items-center w-full mt-3">
        <div className="flex flex-col justify-start w-full mb-6 p-2">
          <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target='_blank' rel="noopener noreferrer">
            <p className='text-white text-base'>From: {shortenAdress(addressFrom)}</p>
          </a>
          <a href={`https://goerli.etherscan.io/address/${addressTo}`} target='_blank' rel="noopener noreferrer">
            <p className='text-white text-base'>To: {shortenAdress(addressTo)}</p>
          </a>
          <p className='text-white text-base'>Amount: {amount}</p>
          {message && (
            <>
              <br />
              <p className='text-white text-base'>Message: {message}</p>
            </>
          )}
        </div>

        <img 
          src={gifUrl || url} 
          alt="gif" 
          className='w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover'
        />

        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
}

export function Transactions() {
  const { currentAccount, transactions } = useContext(TransactionContext);

  return (
    <div className='flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions'>
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className='text-white text-3xl text-center my-2'>
            Latest transactions.
          </h3>
        ) : (
          <h3 className='text-white text-3xl text-center my-2'>
            Connect your account to see the latest transactions.
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {transactions.reverse().map((transactions: any, index: any) => (
            <TransationCard key={index} {...transactions}/>
          ))}
        </div>
      </div>
    </div>
  );
} 