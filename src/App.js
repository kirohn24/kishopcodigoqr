import React, { useState, useRef, useEffect } from 'react';
import QrReader from 'qrreader';
import firebase from './firebase';
import { db } from './firebase';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const [userData, setUserData] = useState(null);
  const qrRef = useRef(null);

  useEffect(() => {
    if (scanResultWebCam) {
      fetchUserData(scanResultWebCam);
    }
  }, [scanResultWebCam]);

  const fetchUserData = async (userId) => {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserData(userData);
      } else {
        console.log('El usuario no existe');
      }
    } catch (error) {
      console.log('Error al obtener los datos del usuario:', error);
    }
  };

  const handleErrorWebCam = (error) => {
    console.log(error);
  };

  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  };

  const habilitar = () => {
    var habilitar = document.getElementById("habilitar");

    // si se presiona el boton habilitar se agregara el estado de habilitado a la base de datos
    habilitar.addEventListener("click", function () {
      db.collection("users").doc(scanResultWebCam).update({
        estado: "Habilitado"
      })
        .then(function () {
          console.log("Document successfully updated!");
          alert("Usuario habilitado");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
          alert("Error al habilitar usuario");
        });
    });
  }

    const deshabilitar = () => {
      var deshabilitar = document.getElementById("deshabilitar");

      // si se presiona el boton deshabilitar se cambiara el estado de habilitado a deshabilitado en la base de datos
      deshabilitar.addEventListener("click", function () {
        db.collection("users").doc(scanResultWebCam).update({
          estado: "Deshabilitado"
        })
          .then(function () {
            console.log("Document successfully updated!");
            alert("Usuario deshabilitado");
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            alert("Error al deshabilitar usuario");
          });
      });
    }


  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Kishop - Confirmar identidad</h2>
        <div className="card-content">
          <div className="qr-scanner">
            <h3>Escanear Codigo QR</h3>
            <QrReader
              delay={300}
              style={{ width: '100%' }}
              onError={handleErrorWebCam}
              onScan={handleScanWebCam}
            />
            <h3>Resultado: {scanResultWebCam}</h3>
          </div>
          {userData && (
            <div className="user-card">
              <img className="profile-img" src={userData.imageUrl} alt="Imagen de perfil" />
              <div className="user-data">
                <p><strong>DNI:</strong> {userData.dni}</p>
                <p><strong>Nombre:</strong> {userData.nombre}</p>
                <p><strong>Apellido:</strong> {userData.apellido}</p>
                <p><strong>Cargo:</strong> {userData.cargo}</p>
                <p><strong>Correo:</strong> {userData.correo}</p>
                <p><strong>Función:</strong> {userData.funcion}</p>
                <p><strong>Código de Seguridad:</strong> ********</p>
              </div>
              <button onClick={habilitar()} id="habilitar" className="btnhabilitar">Habilitar</button>
              <button onClick={deshabilitar()} id="deshabilitar" className="btnrechazar">Deshabilitar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
