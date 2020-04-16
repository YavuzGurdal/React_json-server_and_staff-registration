import React, { useState, useEffect } from 'react'
import './HomePage.css' // scss icin css dosyasini import ediyoruz
import axios from 'axios';
import { v4 as uuid } from 'uuid';


function HomePage() {

    const [list, setList] = useState([])

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [city, setCity] = useState('')
    const [email, setEmail] = useState('')

    const [display, setDisplay] = useState(false)

    const [update, setUpdate] = useState(false)

    const [edit, setEdit] = useState(false) // guncelleme icin
    const [id, setId] = useState('') // guncelleme icin

    const [search, setSearch] = useState(false)


    useEffect(() => {

        axios
            .get('http://localhost:3004/users') // get 1 parametre alir. url adresi
            .then(res => setList(res.data))
            .catch(err => console.log(err))

    }, [update])

    const submitHandler = e => { // burda post metodunu kullandik
        e.preventDefault(); // submit olan butonlarin oldugu yerde yazilmali. sayfanin yenilenmesini engelliyor

        if (!search & (name === '' || surname === '' || city === '' || email === '')) { // bu if kosulunu bos gecilmemesi icin yazdik.
            alert('Bütün alanları doldurunuz!...');
        } else {

            if (!edit & !search) {
                axios
                    .post('http://localhost:3004/users', { // post 2 adet parametre alir. 1.parametre; url adresi , 2.parametre; data
                        id: uuid(),
                        name,
                        surname,
                        city,
                        email

                        // soldakiler key, sagdakiler formdan gelen value'lar. alttakiler yukaridakilerle ayni
                        // name: name,
                        // surname: surname,
                        // city: city,
                        // email: email
                    })
                    .then(res => {
                        //console.log(res.data)
                        setUpdate(!update) // state'i degistirmek icin yaptik. true veya false olmasi onemli degil.
                        // bunu kullanici ekleyince direk ekranda yazmasi icin yazdik

                        // asagidakileri input kisimlarinin bosaltilmasi icin yaptik
                        setName('')
                        setSurname('')
                        setCity('')
                        setEmail('')
                        setDisplay(!display)
                    })
                    .catch(err => console.log(err))

            } else if (edit & !search) { // guncelleme icin
                axios
                    .put(`http://localhost:3004/users/${id}`, { // bu metod mevcut bilgiyi guncellemek icin
                        id: uuid(),
                        name,
                        surname,
                        city,
                        email
                    })
                    .then(res => {
                        setUpdate(!update) // state'i degistirmek icin yaptik. true veya false olmasi onemli degil.
                        // bunu kullanici ekleyince direk ekranda yazmasi icin yazdik

                        // asagidakileri input kisimlarinin bosaltilmasi icin yaptik
                        setName('')
                        setSurname('')
                        setCity('')
                        setEmail('')
                        setDisplay(!display)

                        setEdit(false) // bu ikisi edit icin extra
                        setId('')
                    })
                    .catch(err => console.log(err))

            } else {
                setSearch(false)
                setDisplay(false)
            }

        }
    }

    const editHandler = item => { // asagidakileri yazmamin sebebi sectigim kartin degerlerini yazdirmak
        setName(item.name)
        setSurname(item.surname)
        setCity(item.city)
        setEmail(item.email)

        setEdit(true)

        if (!display) { // display ture da olsa false da olsa, true yapacak
            setDisplay(true)
        }

        setId(item.id) // guncelleme icin
    }

    const deleteHandler = itemId => { // burdaki itemId parametre olarak gelen id
        // silme metodu 1 parametre aliyor.
        axios
            .delete(`http://localhost:3004/users/${itemId}`)
            .then(res => {
                // console.log(res.data)
                setUpdate(!update)
            })
            .catch(err => console.log(err))
    }

    const searchHandler = () => {
        setDisplay(true)
        setName('')
        setSurname('')
        setCity('')
        setEmail('')

        setSearch(!search)
    }

    return (
        <div className='container'>

            {
                display &&
                <div>
                    <form onSubmit={submitHandler}>
                        <h3>{search ? 'Search User' : edit ? 'Update User' : 'Create New User'}</h3>
                        {/* value degerlerini edit yapmak icin atadik */}
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                        {/* inputa attribute olarak required yazarsak bos gecilemez */}
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder='Surname' />
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder='City' />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='E-Mail' />
                        <button type='submit'>{search ? 'Search User' : edit ? 'Update User' : 'Add New User'}</button>
                        {/* form kullandigim icin submit yapiyorum */}
                    </form>
                </div>
            }


            <div>
                <button onClick={() => setDisplay(!display)}>Add User</button>
                <button onClick={searchHandler}>Search User</button>
            </div>

            {/*asagidakini component'e cevirebilirim*/}
            {
                !search && // search yanlışise calisacak

                list.map((item, index) =>

                    <div key={item.id} className="user">
                        <div>
                            <p>{index + 1}</p>
                            <p>{item.name} {' '} {item.surname}</p>
                            <p>{item.city}</p>
                            <p>{item.email}</p>
                        </div>
                        <div>
                            <button onClick={() => editHandler(item)}>Edit</button> {/* itemin hepsini parametre olarak gonderiyorum 
                            fonksiyonda () oldugu icin.....
                            */}
                            <button onClick={() => deleteHandler(item.id)}>Delete</button>
                        </div>
                    </div>

                )
            }

            {
                search && // search dogru ise calisacak

                list.filter(item => item.name.toLowerCase().includes(name)) // burasi filtre yapmak icin
                    .map((item, index) =>

                        <div key={item.id} className="user">
                            <div>
                                <p>{index + 1}</p>
                                <p>{item.name} {' '} {item.surname}</p>
                                <p>{item.city}</p>
                                <p>{item.email}</p>
                            </div>
                            <div>
                                <button onClick={() => editHandler(item)}>Edit</button> {/* itemin hepsini parametre olarak gonderiyorum 
                            fonksiyonda () oldugu icin.....
                            */}
                                <button onClick={() => deleteHandler(item.id)}>Delete</button>
                            </div>
                        </div>

                    )
            }

        </div>
    )
}

export default HomePage
