
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import SplitText from './ui/ReactBIt/SplitText';



export default function Hero() {
  const containerRef = useRef(null);
  return (
    <div  className=" w-full h-screen overflow-x-hidden">
    
      <div className="relative isolate px-6 mt-auto py-24 sm:py-32  lg:px-8">
       
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-20">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Personalized Itineraries at Your Fingertips.{' '}
              <Link to="#" className="font-semibold text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div ref={containerRef} className="text-center relative">
       
            {/*  Split text is shiny text*/}
            <SplitText
 text=" Your Next Adventure with AI" disabled={false} speed={3} className='custom-class text-5xl font-bold tracking-tight  text-gray-900 sm:text-6xl' />
  
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
         
        <SplitText
 text="   Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget." disabled={false} speed={3} className='custom-class ' />
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/travel-preferences"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link to="#" className="text-sm/6 font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
         
        </div>
      </div>
    </div>
  )
}