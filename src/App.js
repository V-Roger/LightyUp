import React from 'react'
import Loader from 'react-loader-spinner'
import logo from './assets/img/logo_lighty.png'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      connecting: false,
      connected: false ,
      mode: 42,
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
    this.device = await navigator.bluetooth.requestDevice({
        filters: [
            { name: 'SP105E' }
        ],
        optionalServices: [0xFFE0],
    });
  
    this.server = await this.device.gatt.connect();
    this.service = await this.server.getPrimaryService(0xFFE0);
    this.characteristic = await this.service.getCharacteristic(0xFFE1);
    await this.characteristic.writeValue(
      new Uint8Array([0x38, 0, 0, 0, 0xaa]) 
    )
    this.setState({
      connecting: false,
      connected: true,
    })
  }

  async setColorMode() {
    if (!this.characteristic) {
      console.error('nc')
      return;
    }
    await this.characteristic.writeValue(
      new Uint8Array([0x38, this.state.mode, 0x00, 0x00, 0x2c])
    )
  }

  async togglePowerState() {
    if (!this.characteristic) {
      console.error('nc')
      return;
    }
    await this.characteristic.writeValue(
      new Uint8Array([0x38, 0, 0, 0, 0xaa]) 
    )
  }

  async changeColor(color) {
    if (!this.characteristic) {
      console.error('nc')
      return;
    }
    const colorInstruction = color === 'blue' ? new Uint8Array([0x38, 0, 0, 0, 0x36]) : new Uint8Array([0x38, 0, 0, 0, 0x12])
    await this.characteristic.writeValue(
      colorInstruction
      // new Uint8Array([0x38, 0, 0, 0, 0xaa])                         // 0   0   0   170
      // new Uint8Array([0x38, 0x2A, 0x00, 0x00, 0x2c])  // MODE         56  {n°mode} 0 0   44
      // new Uint8Array([0x38, 0, 0, 0, 0x12])  // GREEN         56 177 204 111 213
      // new Uint8Array([0x38, 0, 0, 0, 0x36]) // BLUE           194 5   77  54
      // new Uint8Array([0x38, 0, 0, 0, 0x04]) // BLUE           194 5   77  54
    );
    console.log('changed')
  }

  render() {
    return (
      <div className="bg-gray-900 w-screen h-screen">
        <header className="h-1/4 container py-5 mx-auto flex flex-row justify-center align-center shadow-lg">
          <img src={logo} className="h-full" alt="logo" />
        </header>
        <main className="relative h-3/4 w-90 bg-yellow-400 flex flex-col content-center justify-center p-10">
          {
            this.state.connected &&
            <div>
              <div className="">
                <button className="absolute -top-8 right-4 bg-red-600 border-white border-2 rounded-full text-white shadow-sm p-4 transition-all" onClick={() => this.togglePowerState()}>
                  OFF
                </button>
              </div>
              <div className="flex flex-row content-center justify-center">
                <input value={this.state.mode} onChange={this.handleModeChange} className="bg-gray-900 border-white border-2 rounded-lg rounded-r-none text-white shadow-sm p-4 transition-all" type="text"/>
                <button className="bg-gray-900 border-white border-2 rounded-lg rounded-l-none text-white shadow-sm p-4 transition-all" onClick={() => this.setColorMode()}>Mode</button>
              </div>
              <div className="flex flex-row content-center justify-between">
                <button className="bg-indigo-600 border-white border-2 rounded-lg text-white shadow-sm p-4 transition-all mt-5" onClick={() => this.changeColor('blue')}>BLEU</button>
                <button className="bg-green-500 border-white border-2 rounded-lg text-white shadow-sm p-4 transition-all mt-5" onClick={() => this.changeColor('green')}>VERT</button>
                <button className="bg-red-600 border-white border-2 rounded-lg text-white shadow-sm p-4 transition-all mt-5" onClick={() => this.changeColor('red')}>ROUGE</button>
              </div>
            </div>
          }
          {
            !this.state.connected && 
            <button className="bg-gray-900 border-white border-2 w-min mx-auto rounded-full text-white shadow-sm p-8 transition-all text-xl focus:outline-none hover:shadow-xl" onClick={() => this.requestBLEConnection()}>
              {
                this.state.connecting &&
                <Loader type="Rings" color="#00BFFF" height={80} width={80} />
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
