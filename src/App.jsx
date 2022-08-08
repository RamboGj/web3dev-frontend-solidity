import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./App.module.css"
import abi from "./utils/WavePortal.json"

function App() {
  const [currentAccount, setCurrentAccount] = useState("")

  const [allWaves, setAllWaves] = useState([])
  const contractAddress = "0x2967ab431ff469e783E9b4C0a9a8b44b1CA1AfBa"
  const contractABI = abi.abi

  async function getAllWaves() {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      
        // chamar a func getAllWaves de dentro do contrato .sol
        const waves = await wavePortalContract.getAllWaves()
        console.log("waves: ", waves)
        // Pegando os dados que queremos:
        // Endereço do waver, data/hora e mensagem

        let wavesCleaned = []
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          })
        })
        setAllWaves((wavesCleaned))

      }
    } catch (error) {
      console.log("deu bosta", error)
    }
  }

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

        getAllWaves()

      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }

    } catch (error) {
      console.log("Erro na aplicação!", error)
    } 
  }

  async function connectWallet() {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert("Metramask encontrada!")
        return
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      })

      console.log("Conectado", accounts[0])
      setCurrentAccount(accounts[0])

    } catch (error) {
      console.log("erro ao conectar", error)
    }
  }

  async function wave() {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        console.log("Recuperando o número de tchauzinhos...", count.toNumber())

        const waveTxn = await wavePortalContract.wave(`${(await signer.getAddress()).toString()} enviou uma mensagem para você!`)
        console.log("Minerando...", waveTxn.hash)

        await waveTxn.wait()
        console.log("Minerado --", waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()

        console.log("Total de tchauzinhos recuperados...", count.toNumber())

      } else {
        console.log("Objeto Ethereum não encontrado")
      }

    } catch (error) {
        console.log("erro", error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    let wavePortalContract;

    function onNewWave(from, timestamp, message) {
        console.log("NewWave", from, timestamp, mesage)
        setAllWaves(prevState => [
          ...prevState,
          {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
          }
        ])
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      wavePortalContract.on("NewWave", onNewWave)
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave)
      }
    }

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
                {
                  allWaves && allWaves.map((wave) => {
                    return (
                      <li key={wave.timestamp}>
                        <p>Endereço: {wave.address}</p>
                        <p>Data/Horário: {wave.timestamp.toString()}</p>
                        <p>Mensagem: {wave.message}</p>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </>
      }
      
      {!currentAccount && 
        <div className={styles.connectButtonWrapper}>
          <button 
            className={styles.connectWalletButton}
            onClick={connectWallet}>
              Conecte a sua Metamask
          </button>
        </div>
      }
    </div>
  )
}

export default App
