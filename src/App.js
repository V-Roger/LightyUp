import React from 'react'
import Loader from 'react-loader-spinner'
import logo from './assets/img/logo_lighty.png'
import INSTRUCTIONS from './instructions'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      connecting: false,
      connected: false ,
      mode: 42,
      currentInstruction: undefined,
    }
    this.device = undefined
    this.server = undefined
    this.service = undefined
    this.characteristic = undefined

    this.handleModeChange = this.handleModeChange.bind(this);
  }

  async handleModeChange(event) {
    this.setState({
      mode: event.target.value
    })
  }

  async requestBLEConnection() {
    this.setState({
      connecting: true,
    })
    try {
      this.device = await navigator.bluetooth.requestDevice({
          filters: [
              { name: 'SP105E' }
          ],
          optionalServices: [0xFFE0],
      });
    
      this.server = await this.device.gatt.connect();
      this.service = await this.server.getPrimaryService(0xFFE0);
      this.characteristic = await this.service.getCharacteristic(0xFFE1);

      this.setState({
        connecting: false,
        connected: true,
        error: undefined,
      })
    } catch (error) {
      this.setState({
        error,
        connecting: false,
        connected: false,
      })
    }
  }

  async setColorMode() {
    if (!this.characteristic) {
      console.error('nc')
      return;
    }
    await this.characteristic.writeValue(
      INSTRUCTIONS.SET_MODE(this.state.mode)
    )
  }

  async togglePowerState() {
    if (!this.characteristic) {
      console.error('nc')
      return;
    }
    await this.characteristic.writeValue(
      INSTRUCTIONS.TOGGLE_POWER
    )
  }

  async changeColor(color) {
    if (!this.characteristic) {
      console.error('nc')
      return;
    }
    await this.characteristic.writeValue(
      INSTRUCTIONS[color]
    );
  }

  render() {
    return (
      <div className="bg-lighty-yellow w-screen h-screen p-4">
        <header className="bg-gray-900 relative z-40 h-1/4 container py-5 mx-auto flex flex-row justify-center align-center shadow-lg rounded-xl">
          <img src={logo} className="h-full" alt="logo" />
          {
            this.state.connected &&
            <button className="absolute -bottom-8 right-4 bg-red-600 ring-4 ring-white rounded-full text-white shadow-sm p-4 px-8 transition-all shadow-lg" onClick={() => this.togglePowerState()}>
              ⚡
            </button>
          }
        </header>
        <main className="z-0 h-3/4 w-90 bg-lighty-yellow flex flex-col content-between justify-center p-4">
          {
            this.state.error && 
            <h2 className="fixed z-50 top-1/4 ring-4 ring-white right-4 left-4 mt-8 p-4 text-white shadow-sm bg-lighty-blue rounded">
              { this.state.error.toString() }
            </h2>
          }
          {
            this.state.connected &&
            <div className="w-full flex-grow flex flex-col justify-evenly">
              <div className="w-full flex flex-row content-center justify-between">
                <button className="bg-indigo-600 focus:outline-none	ring-4 ring-white rounded-full text-white shadow-lg p-4 px-6 transition-all" onClick={() => this.changeColor('BLUE')}>BLEU</button>
                <button className="bg-green-500 focus:outline-none ring-4 ring-white rounded-full text-white shadow-lg p-4 px-6 transition-all" onClick={() => this.changeColor('GREEN')}>VERT</button>
                <button className="bg-red-600 focus:outline-none ring-4 ring-white rounded-full text-white shadow-lg p-4 px-6 transition-all" onClick={() => this.changeColor('RED')}>ROUGE</button>
              </div>
              <div className="w-full flex flex-row content-center justify-center mt-5">
                <input value={this.state.mode} onChange={this.handleModeChange} className="w-full bg-gray-900 ring-4 ring-white rounded-lg rounded-r-none text-white shadow-sm p-4 transition-all" type="number"/>
                <button className="bg-gray-900 ring-4 ring-white rounded-lg rounded-l-none text-white shadow-lg p-4 transition-all" onClick={() => this.setColorMode()}>✨</button>
              </div>
            </div>
          }
          {
            !this.state.connected && 
            <button className="bg-gray-900 focus:outline-none ring-4 ring-white w-min mx-auto rounded-full text-white shadow-sm p-8 transition-all text-xl focus:outline-none hover:shadow-xl" onClick={() => this.requestBLEConnection()}>
              {
                this.state.connecting &&
                <Loader type="Rings" color="#ffeb0a" height={80} width={80} />
              }
              {
                !this.state.connecting &&
                <span>💡</span>
              }
            </button>
          }
        </main>
      </div>
    )
  };
}

export default App;
