import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

interface TransactionContextValue {
  connectWallet: any,
  currentAccount: any,
  handleChange: any,
  formData: any,
  setFormData: any,
  sendTransaction: any,
  transactions: any,
  isLoading: any,
};

export const TransactionContext = createContext<TransactionContextValue>({ connectWallet: null, currentAccount: null, handleChange: null, formData: null, setFormData: null, sendTransaction: null, transactions: null, isLoading: null });

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionContract;
}

export const TransactionProvider = ({  children }: any) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransationCount] = useState(localStorage.getItem('transactionCount'));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (event: any, name: any) => {
    setFormData((prevState) => ({ ...prevState, [name]: event.target.value }));
  }

  ethereum.on('accountsChanged', () => location.reload());

  const getAllTransations = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction: any) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask.');
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransations();
      } else {
        console.log('No accounts found.');
      }
    } catch (error) {
      console.log(error);
      
      throw new Error('No ethereum object.');
    }
  }

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem('transationCount', transactionCount);
    } catch (error) {
      throw new Error('No ethereum object.');
    }
  }
  
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Install metamask.');

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      
      throw new Error('No ethereum object.');
    }
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install metamask.');

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount); 

      await ethereum.request({ 
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208',            
          value: parsedAmount._hex, 
        }]
      });

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      
      await transactionHash.wait();

      setIsLoading(false);

      const transactionCount = await transactionContract.getTransactionCount();
      
      setTransationCount(transactionCount.toNumber());

      window.location.reload();
    } catch (error) {
      console.log(error);
      
      throw new Error('No ethereum object.');
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [])

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, handleChange, formData, setFormData, sendTransaction, transactions, isLoading }}>
      {children}
    </TransactionContext.Provider>
  )
}