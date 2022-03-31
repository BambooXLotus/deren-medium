import logoM from '../assets/images/logo-m.png'

const Hero = () => {
  return (
    <div className="flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-0">
      <div className="space-y-5 px-10">
        <h1 className="max-w-xl font-serif text-6xl">
          <span className="bg-gradient-to-b from-purple-300 to-purple-900 bg-clip-text text-transparent underline decoration-black decoration-4">
            Deren-Medium
          </span>{' '}
          is a place to write, read, and connect
        </h1>
        <h2>
          It's easy and free to post your thinking on any topic and connect with
          millions of readers.
        </h2>
      </div>
      <img
        className="hidden h-32 md:inline-flex lg:h-full"
        src={logoM.src}
        alt=""
      />
    </div>
  )
}

export default Hero
