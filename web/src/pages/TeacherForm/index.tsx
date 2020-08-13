import React, { useState, FormEvent } from 'react'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import { useHistory } from 'react-router-dom'

import warningIcon from '../../assets/images/icons/warning.svg'

import './styles.css'
import Textarea from '../../components/TextArea'
import Select from '../../components/Select'
import api from '../../services/api'

export default function TeacherForm() {

  const history = useHistory();

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [bio, setBio] = useState('')
  const [subject, setSubject] = useState('')
  const [cost, setCost] = useState('')

  const [scheduleItems, setScheduleItems] = useState([
    { week_day: 0, from: '', to: '' }
  ])

  function addNewScheduleItem() {
    setScheduleItems([
      ...scheduleItems,
      {
        week_day: 0,
        from: '',
        to: ''
      }
    ])
  }

  function handleCreateClass(e: FormEvent) {
    e.preventDefault();

    api.post('classes', {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost: Number(cost),
      schedule: scheduleItems
    }).then(() => {
      alert('Cadastro efetuado com sucesso!')
      history.push('/')
    }).catch(() => {
      alert('Erro ao efetuar cadastro!')
    })
  }
  function setScheduleItemValue(position: number, field: string, value: string) {
    const newArray = scheduleItems.map((scheduleItem, index) => {
      if (index === position) {
        return { ...scheduleItem, [field]: value }
      }

      return scheduleItem;
    })

    setScheduleItems(newArray)
  }
  return (
    <>
      <div id="page-teacher-form" className="container">
        <PageHeader
          title="Que incrível que você quer dar aulas!"
          description="O primeiro passo é preencher esse formulario de inscrição" />

        <main>
          <form onSubmit={handleCreateClass}>
            <fieldset>
              <legend>Seus dados</legend>

              <Input onChange={(e) => { setName(e.target.value) }}
                name="name"
                label="Nome completo"
                value={name} />
              <Input onChange={(e) => { setAvatar(e.target.value) }}
                name="avatar"
                label="Avatar"
                value={avatar} />
              <Input onChange={(e) => { setWhatsapp(e.target.value) }}
                name="whatsapp"
                label="Whatsapp"
                value={whatsapp} />
              <Textarea onChange={(e) => { setBio(e.target.value) }}
                name="bio"
                label="Biografia"
                value={bio} />

            </fieldset>
            <fieldset>
              <legend>Sobre a aula</legend>

              <Select
                name="subject"
                label="Matéria"
                value={subject}
                onChange={(e) => { setSubject(e.target.value) }}
                options={[
                  { value: 'Artes', label: 'Artes' },
                  { value: 'Matematica', label: 'Matematica' },
                  { value: 'Ciencias', label: 'Ciencias' },
                  { value: 'Biologia', label: 'Biologia' }
                ]} />
              <Input
                onChange={(e) => { setCost(e.target.value) }}
                name="cost"
                value={cost}
                label="Custo da sua hora por aula" />

            </fieldset>
            <fieldset>
              <legend>Horários disponiveis
            <button type='button' onClick={addNewScheduleItem}>+ Novo horário</button>
              </legend>
              {scheduleItems.map((scheduleitem, index) => {
                return (
                  <div key={scheduleitem.week_day} className="schedule-item">
                    <Select
                      name="week-day"
                      label="Dia da semana"
                      value={scheduleitem.week_day}
                      onChange={(e) => { setScheduleItemValue(index, 'week_day', e.target.value) }}
                      options={[
                        { value: '0', label: 'Domingo' },
                        { value: '1', label: 'Segunda-feira' },
                        { value: '2', label: 'Terça-feira' },
                        { value: '3', label: 'Quarta-feira' },
                        { value: '4', label: 'Quinta-feira' },
                        { value: '5', label: 'Sexta-feira' },
                        { value: '6', label: 'Sabado' }
                      ]} />
                    <Input
                      name="from"
                      value={scheduleitem.from}
                      onChange={(e) => { setScheduleItemValue(index, 'from', e.target.value) }}
                      label="Das"
                      type="time" />
                    <Input
                      name="to"
                      value={scheduleitem.to}
                      onChange={(e) => { setScheduleItemValue(index, 'to', e.target.value) }}
                      label="Até"
                      type="time" />
                  </div>
                )
              })}
            </fieldset>
            <footer>
              <p>
                <img src={warningIcon} alt="Aviso importante" />
              Importante<br />
              Preencha todos os dados
            </p>
              <button type="submit">
                Salvar cadastro
            </button>
            </footer>
          </form>
        </main>

      </div>
    </>
  )
}