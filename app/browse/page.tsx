import Header from '../../components/magicui/Header';
import BrowseItems from './components/BrowseItems';
import Wrapper from '../../components/magicui/Wrapper';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function BrowsePage() {
  return (
    <ProtectedRoute>
      <div>
        <Wrapper>
          <BrowseItems />
        </Wrapper>
      </div>
    </ProtectedRoute>
  );
}
