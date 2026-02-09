import Header from '../../components/magicui/Header';
import Wrapper from '../../components/magicui/Wrapper';
import ListItem from '../browse/components/ListItem';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function SellPage() {
  return (
    <ProtectedRoute>
      <div className="animate-fade-in">
        <Wrapper>
          <ListItem/>
        </Wrapper>
      </div>
    </ProtectedRoute>
  );
}
