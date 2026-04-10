import {
  MessageCircle,
  Cpu,
  Sparkles,
} from 'lucide-react';

/**
 * Home page — marketing-style placeholder for the template.
 * Replace with your real landing or app shell.
 */
function Home() {

  const steps = [
    {
      number: '1',
      title: 'Describe',
      description: 'Tell the assistant what you want in plain language',
      icon: MessageCircle,
    },
    {
      number: '2',
      title: 'Build',
      description: 'Let AI scaffold UI and logic for you',
      icon: Cpu,
    },
    {
      number: '3',
      title: 'Preview',
      description: 'See the result update as you iterate',
      icon: Sparkles,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col'>
      <div className='flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3'>
            Smart app builder
          </h1>
          <p className='text-base sm:text-lg text-black mb-6'>
            Describe your idea once and ship polished web UI faster—with help from your coding assistant.
          </p>
        </div>

        {/* Steps — single row on large screens */}
        <div className='mb-8'>
          <h2 className='text-lg sm:text-xl font-bold text-black mb-4 text-center'>
            Get started in three steps
          </h2>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8'>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className='flex items-center gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm'>
                    {step.number}
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconComponent className='w-5 h-5 text-blue-600' />
                    <h3 className='font-semibold text-black text-sm'>
                      {step.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='py-3 sm:py-4 px-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4'>
          <p className='text-xs sm:text-sm text-gray-600'>
            Built for modern web development
          </p>
          <p className='text-xs sm:text-sm text-gray-600'>
            This is a template page—replace it with your real experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
