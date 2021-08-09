class User {
    constructor(data){
        this.data = data;

    }
    edit(data){
        for(let key in this.data){
            if(this.data[key] != undefined) this.data[key] = data[key];
        }
    }
    get(){
        return this.data;
    }
}
class Contacts {
    constructor(){
        this.arrData = [];

    }
    add(data){
        const user = new User(data);
        //console.log(user);
        this.arrData.push(user);
        /*this.arrData.forEach((item, id)=>{
            //item.id = +id;
            //console.log(item);
        })*/
        //console.log(this.arrData);
        localStorage.setItem('user', JSON.stringify(this.arrData))

    }
    edit(data,id){
        this.arrData[id].data = data;
        //console.log(this.arrData)
        
        localStorage.setItem('user', JSON.stringify(this.arrData))
        
    }
    remove(id){
        this.arrData.splice(id, 1)
        //console.log(this.arrData)
        localStorage.setItem('user', JSON.stringify(this.arrData))
        
    }
    get(){
        //console.log(this.arrData)
        return this.arrData;
    }
}
class ContactsApp extends Contacts {
    constructor(){
        super();
        this.init();
        
    }

    getData = function getRequest(){
        let url = 'https://jsonplaceholder.typicode.com/users';
        fetch (url)
        .then((response)=> response.json())
        .then((apiData)=> {
            let arrApiData = []
            apiData.forEach(apiItem => {
                arrApiData.push(new User(
                    {
                       name: apiItem.name, 
                       city: apiItem.address.city,
                       phone: apiItem.phone,
                       email: apiItem.email
                    }
                ))
            })
            this.arrData = [...arrApiData]
                localStorage.setItem('user', JSON.stringify(this.arrData))
                this.updateList()
        })
    }

    init(){
        const contactsApp = document.createElement('div');
        contactsApp.classList.add('contacts');
        document.body.appendChild(contactsApp);

        const h1 = document.createElement('h1');
        h1.classList.add('name__app');
        contactsApp.appendChild(h1);

        const inputForm = document.createElement('div');
        inputForm.classList.add('inpuut__form');
        contactsApp.appendChild(inputForm);

        this.inputName = document.createElement('input');
        this.inputName.setAttribute('type','textarea');
        this.inputName.setAttribute('name','Имя');
        this.inputName.setAttribute('placeholder','Введите имя');
        inputForm.appendChild(this.inputName);

        this.inputCity = document.createElement('input');
        this.inputCity.setAttribute('type','textarea');
        this.inputCity.setAttribute('name','Город');
        this.inputCity.setAttribute('placeholder','Введите город');
        inputForm.appendChild(this.inputCity);

        this.inputPhone = document.createElement('input');
        this.inputPhone.setAttribute('type','tel');
        this.inputPhone.setAttribute('name','Телефон');
        this.inputPhone.setAttribute('placeholder','Введите номер телефона');
        inputForm.appendChild(this.inputPhone);

        this.inputEmail = document.createElement('input');
        this.inputEmail.setAttribute('type','email');
        this.inputEmail.setAttribute('name','Email');
        this.inputEmail.setAttribute('placeholder','Введите email');
        inputForm.appendChild(this.inputEmail);

        const contactsBtnAdd = document.createElement('button');
        contactsBtnAdd.classList.add('add__btn');
        contactsBtnAdd.innerHTML = 'Добавить';
        inputForm.appendChild(contactsBtnAdd);

        contactsBtnAdd.addEventListener('click', event =>{
            this.onAdd(event);
            
        });

        this.contactsList = document.createElement('div');
        this.contactsList.classList.add('contacts__list');
        contactsApp.appendChild(this.contactsList);

        let arrData = JSON.parse(localStorage.getItem('user')) || []
        if (arrData.length > 0) {
            let newArr = []
            arrData.forEach((itemData) => {
                newArr.push(new User(itemData.data))
                this.arrData = [...newArr]
                this.updateList()
            })
        } else {
            this.getData()
        }


    }
    updateList(){
        this.contactsList.innerHTML = '';
        
        this.arrData.forEach((user,id) =>{
            const contact = document.createElement('div');
            contact.classList.add('contact__item');
            contact.setAttribute('id', id); //этого не было

            const contactName = document.createElement('p')
            contactName.classList.add('contact__name');
            contactName.innerHTML = user.data.name;

            const contactCity = document.createElement('p');
            contactCity.classList.add('contact__info');
            contactCity.innerHTML = user.data.city;

            const contactPhone = document.createElement('p');
            contactPhone.classList.add('contact__info');
            contactPhone.innerHTML = user.data.phone;

            const contactEmail = document.createElement('p');
            contactEmail.classList.add('contact__info');
            contactEmail.innerHTML = user.data.email;

            const contactButtons = document.createElement('div');
            contactButtons.classList.add('contact__btn');

            //console.log(user.id);
            contact.dataset.id = id;  //исправить
            let btnId = id; //user.id

            this.contactBtnEdit = document.createElement('button');
            this.contactBtnEdit.classList.add('btn__edit');
            this.contactBtnEdit.setAttribute('id',`${btnId}`);
            this.contactBtnEdit.innerHTML = 'Редактировать';
            contactButtons.appendChild(this.contactBtnEdit);

            this.contactBtnRemove = document.createElement('button');
            this.contactBtnRemove.classList.add('btn__remove');
            this.contactBtnRemove.setAttribute('id',`${btnId}`);
            this.contactBtnRemove.innerHTML = 'Удалить';
            contactButtons.appendChild(this.contactBtnRemove);

            contact.appendChild(contactName);
            contact.appendChild(contactCity);
            contact.appendChild(contactPhone);
            contact.appendChild(contactEmail);
            contact.appendChild(contactButtons);

            this.contactsList.appendChild(contact);
             

            this.contactBtnEdit.addEventListener('click', event =>{
                
                this.onEdit(event);
            });
    
            this.contactBtnRemove.addEventListener('click', event =>{
                
                this.onRemove(event);
            });
        });


    }
    onAdd(event){
        //console.log(event)
        if(event.type != 'click') return;

        const data = {
            name: (this.inputName && this.inputName.value.length > 0) ? this.inputName.value: '',
            city: (this.inputCity && this.inputCity.value.length > 0) ? this.inputCity.value: '',
            phone: (this.inputPhone && this.inputPhone.value.length > 0) ? this.inputPhone.value: '',
            email: (this.inputEmail && this.inputEmail.value.length > 0) ? this.inputEmail.value: ''
        };
        //console.log(data);

        if (!this.inputName.dataset.action || !this.inputName.dataset.id) {
            this.add(data)

        } else {
            this.edit(data, this.inputName.dataset.id);
            this.inputName.dataset.action = '';
            this.inputName.dataset.id = '';
        }


        //this.add(data);

        //после добавления очищаем поля вввода
        this.updateList();
        this.inputName.value = '';
        this.inputCity.value = '';
        this.inputEmail.value = '';
        this.inputPhone.value = '';
   
    }
    onEdit(event){
        
        let id = event.target.id;

        const data = this.arrData[id];
        //console.log(user);
        

        this.inputName.value = data.data.name;
        this.inputCity.value = data.data.city;
        this.inputEmail.value = data.data.email;
        this.inputPhone.value = data.data.phone;

        //добавляем dataset для кнопки добавить (при редактировании)
        this.inputName.dataset.action = 'edit';
        this.inputName.dataset.id = id;


    }
    onRemove(event){
        //console.log(event.target.id)
        let id = event.target.id;
        
        //console.log(id);
        this.remove(id)
        this.updateList();
    }

}

let contacts = new Contacts();
/*contacts.add(
    {
    name: 'Alex',
    city: 'Minsk'
});
contacts.add(
    {
    name: 'Jack',
    city: 'Minsk'
});
contacts.add(
    {
    name: 'Bob',
    city: 'Minsk'
});
contacts.add(
    {
    name: 'Mike',
    city: 'Minsk'
});

contacts.edit(
    {
    name: 'Piter',
    city: 'Minsk'
},1);*/
//contacts.remove(1);
contacts.get();
new ContactsApp();