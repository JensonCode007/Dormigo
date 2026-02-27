import Wrapper from '../../components/magicui/Wrapper';
import ListItem from './components/ListItem';
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
