import React, { useEffect, useState } from 'react'
import { View, Image, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'

import styles from './styles'

import LandingImg from '../../assets/images/landing.png'
import studyIcon from '../../assets/images/icons/study.png'
import giveClasses from '../../assets/images/icons/give-classes.png'
import heartIcon from '../../assets/images/icons/heart.png'

import api from '../../services/api'

export default function Landing() {
  const [connections, setConnections] = useState(0)

  const { navigate } = useNavigation();

  function handleNavigateToGiveClassesPage() {
    navigate('GiveClasses')
  }
  function handleNavigateToGiveStudyPage() {
    navigate('Study')
  }

  useEffect(() => {
    api.get('connections').then(response => {
      const { total } = response.data;

      setConnections(total)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Image source={LandingImg} />
      <Text style={styles.title}>
        Seja bem-vindo, {'\n'}
        <Text style={styles.titleBold}>O que deseja fazer?</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <RectButton
          onPress={handleNavigateToGiveStudyPage}
          style={[styles.button, styles.buttonPrimary]
          }>
          <Image source={studyIcon} />
          <Text style={styles.buttonText}>Estudar</Text>
        </RectButton>

        <RectButton
          onPress={handleNavigateToGiveClassesPage}
          style={[styles.button, styles.buttonSecondary]
          }>
          <Image source={giveClasses} />
          <Text style={styles.buttonText}>Dar aulas</Text>
        </RectButton>
      </View>
      <Text style={styles.totalConnections}>
        Total de {connections} conexões ja realizadas {' '}
        <Image source={heartIcon} />
      </Text>
    </View>
  )
}