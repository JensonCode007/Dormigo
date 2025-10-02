import Header from '../../components/magicui/Header';
import Wrapper from '../../components/magicui/Wrapper';
import ListItem from '../browse/components/ListItem';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function SellPage() {
  return (
    <ProtectedRoute>
      <Wrapper>
          <ListItem/>
      </Wrapper>
    </ProtectedRoute>
  );
}
