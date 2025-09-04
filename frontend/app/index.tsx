import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function index() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>O app que te auxilia na sua vida financeira</Text>

      <TouchableOpacity
        style={[styles.button, styles.botao_login]}
        onPress={() => alert('Login pressionado!')}
      >
        <Text style={styles.botao_loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.botao_crieumaconta]}
        onPress={() => alert('Criar conta pressionado!')}
      >
        <Text style={styles.botao_crieumacontaText}>Crie uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20, 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60, 
    marginHorizontal: 20,
    color: '#073C33',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  botao_login: {
    backgroundColor: '#073C33', 
  },
  botao_loginText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  botao_crieumaconta: {
    backgroundColor: '#D1F3DB', 
    marginTop: 15,
  },
  botao_crieumacontaText: {
    color: '#0c0c0c', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});