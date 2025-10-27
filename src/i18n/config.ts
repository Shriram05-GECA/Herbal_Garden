import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "Virtual Herbal Garden",
      subtitle: "Explore nature's pharmacy with our curated collection of medicinal and culinary herbs",
      search: "Search herbs...",
      category: "Category",
      all: "All",
      medicinal: "Medicinal",
      culinary: "Culinary",
      aromatic: "Aromatic",
      benefits: "Benefits",
      uses: "Uses",
      growingConditions: "Growing Conditions",
      medicinalProperties: "Medicinal Properties",
      culinaryUses: "Culinary Uses",
      precautions: "Precautions",
      backToGarden: "Back to Garden",
      about: "About",
    }
  },
  es: {
    translation: {
      title: "Jardín Herbal Virtual",
      subtitle: "Explora la farmacia de la naturaleza con nuestra colección de hierbas medicinales y culinarias",
      search: "Buscar hierbas...",
      category: "Categoría",
      all: "Todas",
      medicinal: "Medicinal",
      culinary: "Culinaria",
      aromatic: "Aromática",
      benefits: "Beneficios",
      uses: "Usos",
      growingConditions: "Condiciones de Cultivo",
      medicinalProperties: "Propiedades Medicinales",
      culinaryUses: "Usos Culinarios",
      precautions: "Precauciones",
      backToGarden: "Volver al Jardín",
      about: "Acerca de",
    }
  },
  fr: {
    translation: {
      title: "Jardin d'Herbes Virtuel",
      subtitle: "Explorez la pharmacie de la nature avec notre collection d'herbes médicinales et culinaires",
      search: "Rechercher des herbes...",
      category: "Catégorie",
      all: "Toutes",
      medicinal: "Médicinale",
      culinary: "Culinaire",
      aromatic: "Aromatique",
      benefits: "Avantages",
      uses: "Utilisations",
      growingConditions: "Conditions de Culture",
      medicinalProperties: "Propriétés Médicinales",
      culinaryUses: "Utilisations Culinaires",
      precautions: "Précautions",
      backToGarden: "Retour au Jardin",
      about: "À propos",
    }
  },
  hi: {
    translation: {
      title: "आभासी औषधीय उद्यान",
      subtitle: "औषधीय और पाक जड़ी-बूटियों के हमारे संग्रह के साथ प्रकृति की फार्मेसी का अन्वेषण करें",
      search: "जड़ी-बूटियाँ खोजें...",
      category: "श्रेणी",
      all: "सभी",
      medicinal: "औषधीय",
      culinary: "पाक",
      aromatic: "सुगंधित",
      benefits: "लाभ",
      uses: "उपयोग",
      growingConditions: "उगाने की स्थितियाँ",
      medicinalProperties: "औषधीय गुण",
      culinaryUses: "पाक उपयोग",
      precautions: "सावधानियाँ",
      backToGarden: "उद्यान में वापस जाएं",
      about: "के बारे में",
    }
  },
  bn: {
    translation: {
      title: "ভার্চুয়াল ভেষজ বাগান",
      subtitle: "ঔষধি এবং রন্ধনসম্পর্কীয় ভেষজ আমাদের সংগ্রহের সাথে প্রকৃতির ফার্মেসি অন্বেষণ করুন",
      search: "ভেষজ খুঁজুন...",
      category: "শ্রেণী",
      all: "সব",
      medicinal: "ঔষধি",
      culinary: "রন্ধনসম্পর্কীয়",
      aromatic: "সুগন্ধযুক্ত",
      benefits: "উপকারিতা",
      uses: "ব্যবহার",
      growingConditions: "চাষের শর্ত",
      medicinalProperties: "ঔষধি বৈশিষ্ট্য",
      culinaryUses: "রান্নার ব্যবহার",
      precautions: "সতর্কতা",
      backToGarden: "বাগানে ফিরে যান",
      about: "সম্পর্কে",
    }
  },
  te: {
    translation: {
      title: "వర్చువల్ మూలికా తోట",
      subtitle: "మా ఔషధ మరియు వంట మూలికల సేకరణతో ప్రకృతి ఫార్మసీని అన్వేషించండి",
      search: "మూలికలను శోధించండి...",
      category: "వర్గం",
      all: "అన్నీ",
      medicinal: "ఔషధ",
      culinary: "వంట",
      aromatic: "సుగంధ",
      benefits: "ప్రయోజనాలు",
      uses: "ఉపయోగాలు",
      growingConditions: "పెరుగుదల పరిస్థితులు",
      medicinalProperties: "ఔషధ లక్షణాలు",
      culinaryUses: "వంట ఉపయోగాలు",
      precautions: "జాగ్రత్తలు",
      backToGarden: "తోటకు తిరిగి వెళ్లండి",
      about: "గురించి",
    }
  },
  ta: {
    translation: {
      title: "மெய்நிகர் மூலிகை தோட்டம்",
      subtitle: "மருத்துவ மற்றும் சமையல் மூலிகைகளின் எங்கள் சேகரிப்புடன் இயற்கையின் மருந்தகத்தை ஆராயுங்கள்",
      search: "மூலிகைகளைத் தேடுங்கள்...",
      category: "வகை",
      all: "அனைத்தும்",
      medicinal: "மருத்துவ",
      culinary: "சமையல்",
      aromatic: "நறுமண",
      benefits: "நன்மைகள்",
      uses: "பயன்கள்",
      growingConditions: "வளரும் நிலைமைகள்",
      medicinalProperties: "மருத்துவ பண்புகள்",
      culinaryUses: "சமையல் பயன்கள்",
      precautions: "முன்னெச்சரிக்கைகள்",
      backToGarden: "தோட்டத்திற்குத் திரும்பு",
      about: "பற்றி",
    }
  },
  mr: {
    translation: {
      title: "आभासी औषधी बाग",
      subtitle: "औषधी आणि स्वयंपाकी औषधी वनस्पतींच्या आमच्या संग्रहासह निसर्गाच्या फार्मसीचा शोध घ्या",
      search: "औषधी वनस्पती शोधा...",
      category: "श्रेणी",
      all: "सर्व",
      medicinal: "औषधी",
      culinary: "स्वयंपाकी",
      aromatic: "सुगंधी",
      benefits: "फायदे",
      uses: "उपयोग",
      growingConditions: "वाढण्याच्या परिस्थिती",
      medicinalProperties: "औषधी गुणधर्म",
      culinaryUses: "स्वयंपाकातील उपयोग",
      precautions: "खबरदारी",
      backToGarden: "बागेत परत या",
      about: "बद्दल",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
