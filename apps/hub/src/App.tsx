import Header from './components/Header';
import Footer from './components/Footer';
import ToolCard from './components/ToolCard';

import quikNoteImage from './assets/images/quiknote-thumbnail.png';
import quikCodeImage from './assets/images/quikcode-thumbnail.png';
import { BsCodeSquare, BsJournalText } from 'react-icons/bs';

const QUIKNOTE_URL = import.meta.env.VITE_QUIKNOTE_URL || "http://localhost:6001";
const QUIKCODE_URL = import.meta.env.VITE_QUIKCODE_URL || "http://localhost:6002";


const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 md:pt-36 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-purple-600 dark:text-purple-400">Quikpad</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your tool and start creating
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* QuikNote Card */}
          <ToolCard 
            title="QuikNote"
            description="Write, organize, and share your notes effortlessly with a clean and intuitive editor."
            icon={BsJournalText}
            imageSrc={quikNoteImage}
            url={QUIKNOTE_URL}
            color="bg-purple-600"
          />

          {/* QuikCode Card */}
          <ToolCard 
            title="QuikCode"
            description="Create, edit, and share code snippets in multiple languages. Fast and hassle-free."
            icon={BsCodeSquare}
            imageSrc={quikCodeImage}
            url={QUIKCODE_URL}
            color="bg-purple-600"
          />
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default App;