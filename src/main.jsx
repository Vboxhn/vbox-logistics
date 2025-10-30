import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Package, LogOut, Plus, Menu, X, Truck, Camera, Check, Eye, EyeOff } from 'lucide-react';

const VBOXApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);
  const [authView, setAuthView] = useState('main');
  const [showPassword, setShowPassword] = useState(false);
  
  const [packages, setPackages] = useState([
    {
      id: 1,
      tracking: 'VB-001-2025',
      service: 'aéreo',
      state: 'Registrado',
      photos: [],
      createdBy: 'Cliente Demo',
      createdAt: '23/10/2025'
    },
    {
      id: 2,
      tracking: 'VB-002-2025',
      service: 'marítimo',
      state: 'Recibido',
      photos: ['Foto 1', 'Foto 2', 'Foto 3'],
      createdBy: 'Cliente Demo',
      createdAt: '22/10/2025'
    }
  ]);

  const [formData, setFormData] = useState({ tracking: '', service: 'aéreo' });
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [miamiForm, setMiamiForm] = useState({ tracking: '', photos: [], estimatedArrival: '' });
  const [hondurasForm, setHondurasForm] = useState({ tracking: '', weight: '', measurements: '', service: 'aéreo', homeDelivery: false });

  const packageStates = ['Registrado', 'Recibido', 'En tránsito', 'Llegó Honduras', 'Pendiente pago', 'Pagado', 'Entregado'];

  const handleLogin = () => {
    if (authForm.email.trim() && authForm.password.trim()) {
      setCurrentUser(authForm.email);
      setAuthForm({ email: '', password: '' });
      setAuthView('main');
    } else {
      alert('Completa email y contraseña');
    }
  };

  const handleRegister = () => {
    if (authForm.email.trim() && authForm.password.trim()) {
      setCurrentUser(authForm.email);
      setAuthForm({ email: '', password: '' });
      setAuthView('main');
      alert('Cuenta creada exitosamente');
    } else {
      alert('Completa email y contraseña');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    setShowMenu(false);
    setAuthView('main');
  };

  const handleAddPackage = () => {
    if (!formData.tracking.trim()) {
      alert('Por favor ingresa tracking');
      return;
    }
    const newPackage = {
      id: Date.now(),
      tracking: formData.tracking,
      service: formData.service,
      state: 'Registrado',
      photos: [],
      createdBy: currentUser,
      createdAt: new Date().toLocaleDateString('es-HN')
    };
    setPackages([...packages, newPackage]);
    setFormData({ tracking: '', service: 'aéreo' });
    setShowForm(false);
    alert('Paquete registrado');
  };

  const handleMiamiAddPackage = () => {
    if (!miamiForm.tracking.trim()) {
      alert('Por favor ingresa tracking');
      return;
    }
    const existing = packages.find(p => p.tracking === miamiForm.tracking);
    if (existing) {
      setPackages(packages.map(p => p.id === existing.id ? { ...p, state: 'Recibido', photos: miamiForm.photos } : p));
    } else {
      setPackages([...packages, {
        id: Date.now(),
        tracking: miamiForm.tracking,
        service: 'aéreo',
        state: 'Recibido',
        photos: miamiForm.photos,
        createdBy: currentUser,
        createdAt: new Date().toLocaleDateString('es-HN')
      }]);
    }
    setMiamiForm({ tracking: '', photos: [], estimatedArrival: '' });
    alert('Paquete recibido');
  };

  const handleMiamiTransit = (pkgId) => {
    const fecha = prompt('Fecha estimada (ej: 3 nov - 6 nov):');
    if (fecha) {
      setPackages(packages.map(p => p.id === pkgId ? { ...p, state: 'En tránsito', estimatedArrival: fecha, transitDate: new Date().toLocaleDateString('es-HN') } : p));
      alert('Enviado a tránsito');
    }
  };

  const handleHondurasProcess = () => {
    if (!hondurasForm.tracking.trim() || !hondurasForm.weight || !hondurasForm.service) {
      alert('Completa todos los datos');
      return;
    }
    const existing = packages.find(p => p.tracking === hondurasForm.tracking);
    if (existing) {
      setPackages(packages.map(p => p.id === existing.id ? { ...p, state: 'Llegó Honduras' } : p));
    } else {
      setPackages([...packages, {
        id: Date.now(),
        tracking: hondurasForm.tracking,
        service: hondurasForm.service,
        state: 'Llegó Honduras',
        photos: [],
        createdBy: currentUser,
        createdAt: new Date().toLocaleDateString('es-HN')
      }]);
    }
    setHondurasForm({ tracking: '', weight: '', measurements: '', service: 'aéreo', homeDelivery: false });
    alert('Procesado');
  };

  const clientPackages = packages.filter(pkg => pkg.createdBy === currentUser || pkg.createdBy === 'Cliente Demo');

  if (!currentUser) {
    if (authView === 'main') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-blue-900">VBOX</h1>
              <p className="text-orange-500 font-bold text-2xl">LOGISTICS</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Package size={24} /> Cliente
                </h3>
                <p className="text-gray-600 text-sm mb-4">Registra y rastrea tus paquetes</p>
                <div className="space-y-2">
                  <button onClick={() => setAuthView('clientLogin')} className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800">
                    Iniciar sesión
                  </button>
                  <button onClick={() => setAuthView('clientRegister')} className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600">
                    Crear cuenta
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <Truck size={24} /> Administración
                </h3>
                <p className="text-gray-600 text-sm mb-4">Sucursal Miami o Honduras</p>
                <button onClick={() => setAuthView('adminLogin')} className="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700">
                  Acceder
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (authView === 'clientLogin') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Cliente - Iniciar sesión</h2>
            <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full border-2 border-gray-300 rounded p-3 mb-4 focus:outline-none focus:border-blue-900" />
            <div className="relative mb-4">
              <input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full border-2 border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button onClick={handleLogin} className="w-full bg-blue-900 text-white py-3 rounded font-semibold mb-2 hover:bg-blue-800">Entrar</button>
            <button onClick={() => setAuthView('main')} className="w-full bg-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-400">Atrás</button>
          </div>
        </div>
      );
    }

    if (authView === 'clientRegister') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Cliente - Crear cuenta</h2>
            <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full border-2 border-gray-300 rounded p-3 mb-4 focus:outline-none focus:border-blue-900" />
            <div className="relative mb-4">
              <input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full border-2 border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button onClick={handleRegister} className="w-full bg-blue-900 text-white py-3 rounded font-semibold mb-2 hover:bg-blue-800">Crear cuenta</button>
            <button onClick={() => setAuthView('main')} className="w-full bg-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-400">Atrás</button>
          </div>
        </div>
      );
    }

    if (authView === 'adminLogin') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-600 to-orange-700 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">Administración</h2>
            <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full border-2 border-gray-300 rounded p-3 mb-4 focus:outline-none focus:border-orange-900" />
            <div className="relative mb-4">
              <input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full border-2 border-gray-300 rounded p-3 focus:outline-none focus:border-orange-900" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="bg-blue-50 p-3 rounded mb-4 text-xs text-blue-700">
              <p><strong>Credenciales:</strong></p>
              <p>Email: admin@vbox.com</p>
              <p>Contraseña: admin123</p>
            </div>
            <button onClick={() => {
              if (authForm.email === 'admin@vbox.com' && authForm.password === 'admin123') {
                setUserType('miami');
                handleLogin();
              } else {
                alert('Credenciales incorrectas');
              }
            }} className="w-full bg-orange-600 text-white py-3 rounded font-semibold mb-2 hover:bg-orange-700">Sucursal Miami</button>
            <button onClick={() => {
              if (authForm.email === 'admin@vbox.com' && authForm.password === 'admin123') {
                setUserType('honduras');
                handleLogin();
              } else {
                alert('Credenciales incorrectas');
              }
            }} className="w-full bg-green-600 text-white py-3 rounded font-semibold mb-2 hover:bg-green-700">Sucursal Honduras</button>
            <button onClick={() => setAuthView('main')} className="w-full bg-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-400">Atrás</button>
          </div>
        </div>
      );
    }
  }

  if (userType === null || userType === 'cliente') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">VBOX</h1>
            <button onClick={() => setShowMenu(!showMenu)} className="p-2">
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {showMenu && (
            <div className="bg-blue-800 rounded p-3 mt-2">
              <p className="text-sm mb-2">📧 {currentUser}</p>
              <button onClick={handleLogout} className="w-full bg-red-600 py-2 rounded font-semibold text-sm">
                <LogOut size={16} className="inline mr-2" /> Cerrar
              </button>
            </div>
          )}
        </div>

        <div className="p-4 pb-24">
          <button onClick={() => setShowForm(!showForm)} className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2">
            <Plus size={20} /> Registrar paquete
          </button>

          {showForm && (
            <div className="bg-white rounded-lg p-4 mb-4 shadow border-l-4 border-blue-900">
              <h3 className="font-bold text-gray-800 mb-3">Registrar paquete</h3>
              <input type="text" placeholder="VB-001-2025" value={formData.tracking} onChange={(e) => setFormData({ ...formData, tracking: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-3 focus:border-blue-900" />
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Tipo de servicio</label>
              <select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-4">
                <option value="aéreo">🛫 Aéreo (6-9 días)</option>
                <option value="marítimo">🌊 Marítimo (15 días)</option>
                <option value="express">⚡ Express (2-3 días)</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddPackage} className="flex-1 bg-green-600 text-white py-2 rounded font-semibold">Registrar</button>
                <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold">Cancelar</button>
              </div>
            </div>
          )}

          <h2 className="font-bold text-gray-800 mb-3">Mis paquetes</h2>
          {clientPackages.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
              <p>Sin paquetes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientPackages.map(pkg => (
                <div key={pkg.id} onClick={() => setSelectedPackageDetail(pkg.id)} className="bg-white rounded-lg p-4 shadow hover:shadow-lg cursor-pointer border-l-4 border-blue-900">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-lg">{pkg.tracking}</p>
                      <p className="text-sm text-gray-600">Servicio: {pkg.service.toUpperCase()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${pkg.state === 'Entregado' ? 'bg-green-100 text-green-700' : pkg.state === 'Pagado' ? 'bg-blue-100 text-blue-700' : pkg.state === 'Recibido' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                      {pkg.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedPackageDetail && (() => {
            const pkg = clientPackages.find(p => p.id === selectedPackageDetail);
            return pkg ? (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg">{pkg.tracking}</h3>
                      <button onClick={() => setSelectedPackageDetail(null)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                      </button>
                    </div>

                    {pkg.photos && pkg.photos.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">📸 Fotos ({pkg.photos.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.photos.map((photo, idx) => (
                            <div key={idx} className="bg-gray-300 w-16 h-16 rounded flex items-center justify-center text-xs">📷</div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-3 rounded mb-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900">ESTADO</p>
                      <p className="text-2xl font-bold text-blue-900">{pkg.state}</p>
                    </div>

                    {pkg.state === 'En tránsito' && (
                      <div className="bg-yellow-50 p-3 rounded mb-4 border border-yellow-200">
                        <p className="text-xs text-yellow-700 font-semibold">📅 Llegada estimada:</p>
                        <p className="text-lg font-bold text-yellow-900">{pkg.estimatedArrival || '7-10 días'}</p>
                        {pkg.transitDate && <p className="text-xs text-yellow-600 mt-1">Salió: {pkg.transitDate}</p>}
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold">Servicio</p>
                        <p className="text-gray-800 font-bold">{pkg.service.toUpperCase()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold">Registrado</p>
                        <p className="text-gray-800">{pkg.createdAt}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Progreso</p>
                      <div className="space-y-1">
                        {packageStates.map((state) => (
                          <div key={state} className={`p-2 rounded text-sm ${pkg.state === state ? 'bg-green-100 text-green-800 font-bold' : packageStates.indexOf(pkg.state) > packageStates.indexOf(state) ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
                            {packageStates.indexOf(pkg.state) >= packageStates.indexOf(state) ? '✓' : '○'} {state}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setSelectedPackageDetail(null)} className="w-full bg-blue-900 text-white py-2 rounded font-semibold">Cerrar</button>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    );
  }

  if (userType === 'miami') {
    const miamiPackages = packages.filter(p => ['Recibido', 'En tránsito', 'Registrado'].includes(p.state));
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-orange-500 text-white p-4 sticky top-0 z-50 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">VBOX</h1>
              <p className="text-xs">🌴 Miami</p>
            </div>
            <button onClick={() => setShowMenu(!showMenu)} className="p-2">
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {showMenu && (
            <button onClick={handleLogout} className="w-full mt-2 bg-red-600 py-2 rounded font-semibold text-sm">
              <LogOut size={16} className="inline mr-2" /> Cerrar
            </button>
          )}
        </div>

        <div className="p-4 pb-24">
          <div className="bg-white rounded-lg p-4 mb-4 shadow border-l-4 border-orange-500">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Check size={20} className="text-green-600" /> Paquete Recibido
            </h3>
            <input type="text" placeholder="Tracking" value={miamiForm.tracking} onChange={(e) => setMiamiForm({ ...miamiForm, tracking: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-3" />
            <div className="border-2 border-dashed border-orange-300 rounded p-4 text-center mb-3">
              <Camera size={32} className="mx-auto text-orange-400 mb-2" />
              <p className="text-sm text-gray-600">Fotos: {miamiForm.photos.length}</p>
              <button onClick={() => { const photos = [...miamiForm.photos]; photos.push(`Foto ${photos.length + 1}`); setMiamiForm({ ...miamiForm, photos }); }} className="mt-2 text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded">
                + Agregar
              </button>
            </div>
            <button onClick={handleMiamiAddPackage} className="w-full bg-green-600 text-white py-3 rounded font-semibold">Registrar</button>
          </div>

          <h2 className="font-bold text-gray-800 mb-3">Paquetes</h2>
          {miamiPackages.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
              <p>Sin paquetes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {miamiPackages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-lg p-4 shadow border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">{pkg.tracking}</p>
                      <p className="text-xs text-gray-600">{pkg.service}</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">{pkg.state}</span>
                  </div>
                  {pkg.photos && pkg.photos.length > 0 && <p className="text-xs text-gray-600 mb-2">📸 {pkg.photos.length} foto(s)</p>}
                  {pkg.state === 'Recibido' && (
                    <button onClick={() => handleMiamiTransit(pkg.id)} className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700">
                      📦 Tránsito
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const hondurasPackages = packages.filter(p => ['En tránsito', 'Llegó Honduras'].includes(p.state));
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">VBOX</h1>
            <p className="text-xs">🇭🇳 Honduras</p>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="p-2">
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {showMenu && (
          <button onClick={handleLogout} className="w-full mt-2 bg-red-600 py-2 rounded font-semibold text-sm">
            <LogOut size={16} className="inline mr-2" /> Cerrar
          </button>
        )}
      </div>

      <div className="p-4 pb-24">
        <div className="bg-white rounded-lg p-4 mb-4 shadow border-l-4 border-green-600">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Truck size={20} className="text-green-600" /> Procesar
          </h3>
          <input type="text" placeholder="Tracking" value={hondurasForm.tracking} onChange={(e) => setHondurasForm({ ...hondurasForm, tracking: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-3" />
          <input type="number" placeholder="Peso (lb)" value={hondurasForm.weight} onChange={(e) => setHondurasForm({ ...hondurasForm, weight: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-3" step="0.1" />
          <input type="text" placeholder="<input type="text" placeholder="Medidas" value={hondurasForm.measurements} onChange={(e) => setHondurasForm({ ...hondurasForm, measurements: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-3" />
          <select value={hondurasForm.service} onChange={(e) => setHondurasForm({ ...hondurasForm, service: e.target.value })} className="w-full border-2 border-gray-300 rounded p-3 mb-3">
            <option value="aéreo">Aéreo</option>
            <option value="marítimo">Marítimo</option>
            <option value="express">Express</option>
          </select>
          <label className="flex items-center gap-2 bg-yellow-50 p-3 rounded mb-3 border border-yellow-200">
            <input type="checkbox" checked={hondurasForm.homeDelivery} onChange={(e) => setHondurasForm({ ...hondurasForm, homeDelivery: e.target.checked })} className="w-4 h-4" />
            <span className="text-gray-800 font-semibold">Despacho a domicilio</span>
          </label>
          <button onClick={handleHondurasProcess} className="w-full bg-green-600 text-white py-3 rounded font-semibold">Procesar</button>
        </div>

        <h2 className="font-bold text-gray-800 mb-3">Paquetes</h2>
        {hondurasPackages.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500">
            <p>Sin paquetes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hondurasPackages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-lg p-4 shadow border-l-4 border-green-600">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">{pkg.tracking}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{pkg.state}</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Servicio: {pkg.service?.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VBOXApp;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VBOXApp />
  </React.StrictMode>
);
