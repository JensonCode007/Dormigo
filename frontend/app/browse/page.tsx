import BrowseItems from './components/BrowseItems';
import Wrapper from '../../components/magicui/Wrapper';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function BrowsePage() {
  return (
    <ProtectedRoute>
      <div className="animate-fade-in">
        <Wrapper>
          <BrowseItems />
        </Wrapper>
      </div>
    </ProtectedRoute>
  );
}
