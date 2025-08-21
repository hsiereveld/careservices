interface Testimonial {
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    name: "María González",
    role: "Expatriada",
    location: "Madrid",
    rating: 5,
    text: "Encontré un electricista excelente que habla español perfecto. El servicio fue rápido y profesional.",
    avatar: "👩🏻‍💼",
    service: "Servicios Técnicos"
  },
  {
    name: "Ahmed Hassan",
    role: "Estudiante Internacional",
    location: "Barcelona", 
    rating: 5,
    text: "La ayuda con mi documentación fue increíble. El profesional me explicó todo paso a paso.",
    avatar: "👨🏽‍🎓",
    service: "Administrativo"
  },
  {
    name: "Sophie Dubois",
    role: "Profesional Expatriada",
    location: "Valencia",
    rating: 5,
    text: "Perfecto para encontrar cuidado de niños de confianza. Mi hija está muy feliz con su nueva niñera.",
    avatar: "👩🏼‍💻",
    service: "Cuidado Infantil"
  }
];

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className = "" }: TestimonialsProps) {
  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Lo Que Dicen Nuestros Usuarios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Testimonios reales de personas que encontraron los servicios perfectos a través de nuestra plataforma
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
                <span className="ml-2 text-sm text-gray-600 bg-primary-50 px-2 py-1 rounded-full">
                  {testimonial.service}
                </span>
              </div>
              
              <p className="text-gray-700 italic">&ldquo;{testimonial.text}&rdquo;</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">¿Quieres compartir tu experiencia?</p>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Escribir Reseña
          </button>
        </div>
      </div>
    </section>
  );
}
