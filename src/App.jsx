import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./App.module.css"

function App() {
  const [currentAccount, setCurrentAccount] = useState("")

  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log("Parece que vocÊ não tem a Metamask instalada!")
        return
      } else {
        console.log("Objeto ethereum existe", ethereum)
      }

      const accounts = await ethereum.request({
        method: "eth_accounts"
      })

      if (accounts.lenght !== 0) {
        const account = accounts[0]
        console.log("A conta autorizada foi encontrada", account)
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }

    } catch (error) {
      console.log("Erro na aplicação!", error)
    } 
  }

  function wave() {
    console.log("waving")
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className={styles.wrapper}>
      
      {currentAccount && 
        <>
          <div className={styles.profile}>
            <h1>
              Olá pessoal!
            </h1>
            <p>
              Sou um desenvolvedor web e web3!
            </p>
          </div>
          <div className={styles.sendWaveSection}>
            <button 
              onClick={wave}  
            >
              Mandar tchauzinho 🌟
            </button>
            <div className={styles.waveList}>
              <ul>
                <li>
                  <h1>AAAAAAAAA</h1>
                </li>
                <li>
                  <h1>AAAAAAAAA</h1>
                </li>
                <li>
                  <h1>AAAAAAAAA</h1>
                </li>
              </ul>
            </div>
          </div>
        </>
      }
      
      {!currentAccount && 
        <div>
          <button>
            Conecte a sua Metamask
          </button>
        </div>
      }
    </div>
  )
}

export default App
