import { ScrollView } from 'react-native';
import AuthTabScreen from '../../components/authTabScreen';
import UpdatePass from './../../components/updatePass';

const RenewPass = () => {
  return (
    <AuthTabScreen>
      <ScrollView>
        <UpdatePass />
      </ScrollView>
    </AuthTabScreen>
  )
}

export default RenewPass