"use client"

import Cookies from 'js-cookie'
import { useEffect, useRef, useState} from 'react'
import { toPng } from 'html-to-image'
import { ChromePicker} from 'react-color'
import { StoryElement } from '@/Types/types'
import { updateElementPosition, updateElementSize } from '@/utils/story/utils'
import { DraggableElement } from '@/components/story/DraggableElement'
import { AnimatePresence, motion} from 'motion/react'
import { poststoryapi } from '@/utils/clientAction'
import { useRouter } from 'next/navigation'
import MusicSelect from '@/components/story/MusicSelect'
import { ScaleLoader } from 'react-spinners'

interface Track {
  _id: string;
  title: string;
  artist: string;
  previewUrl: string;
  duration: number;
  start: number; // user-selected start second
  end: number;   // user-selected end second
}

// ---------------------- Main Page ----------------------
export default function Page() {
  const route = useRouter()
  const userId = Cookies.get('user')
  const storyRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('Hello 👋')
  const [size, setSize] = useState(16)
  const [z, setZ] = useState<number>(1)
  const [Track, setTrack] = useState<Track>()
  const [show, setShow] = useState(false)
  const [bgColor, setBgColor] = useState<string>('#1a1e23')
  const [stickers] = useState<string[]>(['🔥', '🎉', '🌟'])
  const [elements, setElements] = useState<StoryElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [textBgColor, setTextBgColor] = useState<string>('rgba(0,0,0,0.5)')
  const [textColor, setTextColor] = useState<string>('#ffffff')

  const selectedElement = elements.find((el) => el.id === selectedId)

  const updateSelectedElement = (props: Partial<StoryElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...props } : el))
    )
  }

  const handleAddText = () => {
    const id = crypto.randomUUID()
    setElements((prev) => [
      ...prev,
      {
        id,
        type: 'text',
        content: text,
        bgColor: textBgColor,
        textColor: textColor,
        fontSize: 16,
        z
      },
    ])
    setSelectedId(id)
  }

  const handleAddSticker = (emoji: string) => {
    const id = crypto.randomUUID()
    setElements((prev) => [
      ...prev,
      { id, type: 'sticker', content: emoji, fontSize: 32,z },
    ])
    setSelectedId(id)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const id = crypto.randomUUID()
          const base64 = reader.result as string
          setElements((prev) => [
            ...prev,
            { id, type: 'image', content: base64 },
          ])
          setSelectedId(id)
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const triggerImageUpload = () => {
    imageInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!storyRef.current) return;

    // Temporarily remove overflow to capture full content
    const originalOverflow = storyRef.current.style.overflow;
    storyRef.current.style.overflow = 'visible';

    // Wait a frame
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const width = storyRef.current.offsetWidth;
    const height = storyRef.current.offsetHeight;

    // Capture without manually scaling
    const dataUrl = await toPng(storyRef.current, {
      cacheBust: true,
      width,
      height,
      pixelRatio: 2, // Better quality without manual transform
    });

    // Restore original styles
    storyRef.current.style.overflow = originalOverflow;

    const blob = await (await fetch(dataUrl)).blob()
    const form = new FormData()
    form.append('image', blob)
    form.append('userID', userId || '')
    form.append('SongId', Track?._id || '')
    form.append('start', Track?.start.toString() || '0')
    form.append('end', Track?.end.toString() || '15')
    
    const res = await poststoryapi({form})
    route.push('/')
  }

  const changeFontSize = (delta: number) => {
    if (!selectedElement) return
    const newSize = (selectedElement.fontSize || 1) + delta
    updateSelectedElement({ fontSize: newSize })
    setSize(newSize)
  }

  const changeZ = (delta: number) => {
    if (!selectedElement) return
    const newZ = (selectedElement.z || 1) + delta
    updateSelectedElement({ z: newZ })
    setZ(newZ)
  }
  
  useEffect(() => {
    if (selectedElement) {
      setSize(selectedElement.fontSize || 16)
      setZ(selectedElement.z || 1)
    }
  }, [selectedElement])

  const handleTrackSelect = (track: Track & { start: number, end: number }) => {
  // Save to state or send to backend
  setTrack(track)
};

  return (
    <div className="flex p-4 w-full h-screen overflow-clip">
      <div className='flex flex-col items-center gap-2 w-full md:w-1/2 h-full'>
        <div
          ref={storyRef}
          className="relative shadow border-[#3e4a57] border-1 rounded w-[310px] md:w-90 h-132 sm:h-[85%] sm:max-h-160 overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {elements.map((el, i) => (
            <DraggableElement
              key={el.id}
              id={el.id}
              isSelected={selectedId === el.id}
              onClick={() => setSelectedId(el.id)}
              zIndex={el.z ?? 1}
              position={{ x: el.x || 0, y: el.y || 0 }}
              size={{ width: el.width || 100, height: el.height || 100 }}
              onDragEnd={(x, y) => updateElementPosition(el.id, x, y, setElements)}
              onResizeEnd={(w, h) => updateElementSize(el.id, w, h, setElements)}
            >
              {el.type === "image" ? (
                <div className="flex justify-center items-center w-full h-full">
                  <img src={el.content} className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div
                  className="flex justify-center items-center w-full h-full text-center"
                  style={{
                    backgroundColor: el.bgColor,
                    color: el.textColor,
                    fontSize: `${el.fontSize || 16}px`,
                  }}
                >
                  {el.content}
                </div>
              )}
            </DraggableElement>
          ))}
        </div>
        <motion.button
          whileHover={{scale:1.1}}
          whileTap={{scale: 0.8}}
          onClick={()=>{setSelectedId(null);handleSubmit()}}
          className="bg-[#03b5be] shadow px-6 py-2 rounded font-semibold text-[#ffffff]"
        >
          📤 Post Story
        </motion.button>
      </div>

      <motion.div 
        whileTap={{ scale: 0.8 }} 
        className='sm:hidden right-1 bottom-30 z-1001 absolute bg-gradient-to-l from-[#7726b4] to-[#c85eee] p-3 rounded-md' 
        onClick={()=>setShow(!show)}
      >{show ?'close':'Add'}</motion.div>

      <MusicSelect reg={15} onSelect={handleTrackSelect}/>

      <AnimatePresence mode='popLayout'>
        
        {show && 
          <motion.div
            key={1}
            initial={{x: -300}}
            animate={{x: 25}}
            exit={{x: -300}}
            className='sm:hidden block top-0 left-0 z-1000 absolute bg-[#1a1e23] p-5 border-[#3e4a57] border-1 rounded-2xl w-[86%] h-full overflow-y-auto'
          >
            <div className="space-y-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your story text"
                className="shadow-[#2ef5ff9b] shadow-2xl px-4 py-2 border-[#3e4a57] border-1 focus:border-[#2EF6FF] rounded-md outline-none w-full"
              />

              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileTap={{scale:0.8}}
                  onClick={handleAddText}
                  className="bg-[#3e4a57] shadow-[#2ef5ff9b] shadow-2xl px-4 py-1 rounded text-white"
                >
                  ➕ Add Text
                </motion.button>

                <motion.button
                  whileTap={{scale:0.8}}
                  onClick={triggerImageUpload}
                  className="bg-[#3e4a57] shadow-[#2ef5ff9b] shadow-2xl px-4 py-1 rounded"
                >
                  📷 Add Image
                </motion.button>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div>
                  {stickers.map((emoji, i) => (
                    <button
                      key={emoji+i}
                      onClick={() => handleAddSticker(emoji)}
                      className="text-2xl hover:scale-110 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mb-40 w-50 h-20">
                  <p className="font-semibold text-[#b0bec5] text-sm">background Color</p>
                  <div className="chrome-picker">
                    <ChromePicker
                      color={bgColor || '#fff'}
                      onChange={(color) =>
                        setBgColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                      }
                      styles={{
                        default: {
                          picker: {
                            borderRadius: '18px',
                            boxShadow: 'none',
                            width: '100%',
                            background: '#1a1e23',
                            color: 'white',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                
                {selectedElement && selectedElement.type !== 'image' && (
                  <div className="gap-4 grid grid-cols-1">
                    <div className="flex items-center gap-2">
                      <span>Size</span>
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeFontSize(-1)}
                        className="bg-[#3e4a57] px-2 rounded"
                      >-</motion.button>
                      <input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateSelectedElement({fontSize:e.target.valueAsNumber})}
                        placeholder="Enter your story text"
                        className="px-2 py-1 border-[#3e4a57] border-1 rounded w-15"
                      />
                      <span>px</span>
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeFontSize(1)} 
                        className="bg-[#3e4a57] px-2 rounded"
                      >+</motion.button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Z-index</span>
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeZ(-1)}
                        className="bg-[#3e4a57] px-2 rounded"
                      >-</motion.button>
                      <input
                        type="number"
                        value={selectedElement.z}
                        onChange={(e) => updateSelectedElement({z:e.target.valueAsNumber})}
                        placeholder="Enter your story text"
                        className="px-2 py-1 border-[#3e4a57] border-1 rounded w-15"
                      />
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeZ(1)} 
                        className="bg-[#3e4a57] px-2 rounded"
                      >+</motion.button>
                    </div>
                  </div>
                )}

                {selectedElement?.type === 'text' && (
                  <div className="gap-4 grid grid-cols-2">
                    <div className='w-full h-full'>
                      <p className="font-semibold text-[#b0bec5] text-sm">Text Color</p>
                      <div className="chrome-picker">
                        <ChromePicker
                          color={selectedElement.textColor || '#fff'}
                          onChange={(color) =>
                            updateSelectedElement({ textColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` })
                          }
                          styles={{
                            default: {
                              picker: {
                                borderRadius: '18px',
                                boxShadow: 'none',
                                width: '100%',
                                background: '#1a1e23',
                                color: 'white',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className='w-full h-full'>
                      <p className="font-semibold text-[#b0bec5] text-sm">Background</p>
                      <div className="chrome-picker">
                        <ChromePicker
                        color={selectedElement.bgColor || 'rgba(0,0,0,0.5)'}
                        onChange={(color) =>
                          updateSelectedElement({ bgColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` })
                        }
                        styles={{
                          default: {
                            picker: {
                              borderRadius: '18px',
                              boxShadow: 'none',
                              width: '100%',
                              background: '#1a1e23',
                              color: 'white',
                            },
                          },
                        }}
                      />
                      </div>
                    </div>
                  </div>
                )}

                {selectedId && (
                  <motion.button
                    whileTap={{scale:0.8}}
                    onClick={() => setElements(e => e.filter(el => el.id !== selectedId))}
                    className='bg-red-600 px-3 py-1 rounded-md w-25 font-semibold text-center'
                  >
                    🗑️ Delete
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        }
          <motion.div
            key={2}
            initial={{x: -300}}
            animate={{x: 25}}
            exit={{x: -300}}
            className='hidden sm:block p-5 w-1/2 h-full overflow-y-auto'
          >
            {Track && <div className='text-sm'>
              <div className='flex gap-2'>
                song: {Track.title} by {Track.artist} 
                <div className='drop-shadow-blue-400/80 drop-shadow-xl fill-indigo-500'><ScaleLoader margin={1} height={20} width={3} radius={50} color='#2EF6FF' speedMultiplier={1.5}/></div>
              </div>
              <div className='bg-red-500 mb-3 px-2 py-1 rounded-md w-16' onClick={()=>setTrack(undefined)}>remove</div>
            </div>}
            <div className="space-y-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your story text"
                className="shadow-[#2ef5ff89] shadow-2xl px-4 py-2 border-[#3e4a57] border-1 focus:border-[#2EF6FF] rounded-md outline-none w-full"
              />

              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{scale:1.07}}
                  whileTap={{scale:0.8}}
                  onClick={handleAddText}
                  className="bg-[#3e4a57] shadow-[#2ef5ffaa] shadow-2xl px-4 py-1 rounded text-white"
                >
                  ➕ Add Text
                </motion.button>

                <motion.button
                  whileHover={{scale:1.07}}
                  whileTap={{scale:0.8}}
                  onClick={triggerImageUpload}
                  className="bg-[#3e4a57] shadow-[#2ef5ff9b] shadow-2xl px-4 py-1 rounded"
                >
                  📷 Add Image
                </motion.button>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  {stickers.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddSticker(emoji)}
                      className="text-2xl hover:scale-110 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mb-40 w-50 h-30">
                  <p className="font-semibold text-[#b0bec5] text-sm">background Color</p>
                  <div className="chrome-picker">
                    <ChromePicker
                      color={bgColor || '#fff'}
                      onChange={(color) =>
                        setBgColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                      }
                      styles={{
                        default: {
                          picker: {
                            borderRadius: '18px',
                            boxShadow: 'none',
                            width: '100%',
                            background: '#1a1e23',
                            color: 'white',
                          },
                        },
                      }}
                      />
                  </div>
                </div>

                {selectedElement && selectedElement.type !== 'image' && (
                  <div className="gap-2 grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeFontSize(-1)}
                        className="bg-[#3e4a57] px-2 rounded"
                      >-</motion.button>
                      <input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateSelectedElement({fontSize:e.target.valueAsNumber})}
                        placeholder="Enter your story text"
                        className="px-2 py-1 border-[#3e4a57] border-1 rounded w-15"
                      />
                      <span>px</span>
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeFontSize(1)} 
                        className="bg-[#3e4a57] px-2 rounded"
                      >+</motion.button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Z-index: </span>
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeZ(-1)}
                        className="bg-[#3e4a57] px-2 rounded"
                      >-</motion.button>
                      <input
                        type="number"
                        value={selectedElement.z}
                        onChange={(e) => updateSelectedElement({z:e.target.valueAsNumber})}
                        placeholder="Enter your story text"
                        className="px-2 py-1 border-[#3e4a57] border-1 rounded w-15"
                      />
                      <motion.button
                        whileHover={{scale:1.06}}
                        whileTap={{scale:0.8}}
                        onClick={() => changeZ(1)} 
                        className="bg-[#3e4a57] px-2 rounded"
                      >+</motion.button>
                    </div>
                  </div>
                )}

                {selectedElement?.type === 'text' && (
                  <div className="gap-4 grid grid-cols-2 mt-5">
                    <div className='w-full h-full'>
                      <p className="font-semibold text-[#b0bec5] text-sm">Text Color</p>
                      <div className="chrome-picker">
                        <ChromePicker
                          color={selectedElement.textColor || '#fff'}
                          onChange={(color) =>
                            updateSelectedElement({ textColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` })
                          }
                          styles={{
                            default: {
                              picker: {
                                borderRadius: '18px',
                                boxShadow: 'none',
                                width: '100%',
                                background: '#1a1e23',
                                color: 'white',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className='w-full h-full'>
                      <p className="font-semibold text-[#b0bec5] text-sm">Background</p>
                      <div className="chrome-picker">
                        <ChromePicker
                        color={selectedElement.bgColor || 'rgba(0,0,0,0.5)'}
                        onChange={(color) =>
                          updateSelectedElement({ bgColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` })
                        }
                        styles={{
                          default: {
                            picker: {
                              borderRadius: '18px',
                              boxShadow: 'none',
                              width: '100%',
                              background: '#1a1e23',
                              color: 'white',
                            },
                          },
                        }}
                      />
                      </div>
                    </div>
                  </div>
                )}

                {selectedId && (
                  <motion.button
                    whileHover={{scale:1.06}}
                    whileTap={{scale:0.8}}
                    onClick={() => setElements(e => e.filter(el => el.id !== selectedId))}
                    className='bg-red-600 px-3 py-1 rounded-md w-25 font-semibold text-center'
                  >
                    🗑️ Delete
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
      
    </div>
  )
}