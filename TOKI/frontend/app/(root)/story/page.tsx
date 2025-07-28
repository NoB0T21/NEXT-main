"use client"

import { useEffect, useRef, useState} from 'react'
import { toPng } from 'html-to-image'
import Cookies from 'js-cookie'
import { ChromePicker, SketchPicker } from 'react-color'
import { StoryElement } from '@/Types/types'
import { updateElementPosition, updateElementSize } from '@/utils/story/utils'
import { DraggableElement } from '@/components/story/DraggableElement'
import { AnimatePresence, motion, scale } from 'motion/react'

// ---------------------- Main Page ----------------------
export default function Page() {
  const userId = Cookies.get('user')
  const storyRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('Hello 👋')
  const [size, setSize] = useState(16)
  const [show, setShow] = useState(true)
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
      },
    ])
    setSelectedId(id)
  }

  const handleAddSticker = (emoji: string) => {
    const id = crypto.randomUUID()
    setElements((prev) => [
      ...prev,
      { id, type: 'sticker', content: emoji, fontSize: 32 },
    ])
    setSelectedId(id)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const id = crypto.randomUUID()
        const url = URL.createObjectURL(file)
        setElements((prev) => [
          ...prev,
          { id, type: 'image', content: url },
        ])
        setSelectedId(id)
      })
    }
  }

  const triggerImageUpload = () => {
    imageInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!storyRef.current) return
    const dataUrl = await toPng(storyRef.current)
    const blob = await (await fetch(dataUrl)).blob()
    const form = new FormData()
    form.append('image', blob)
    form.append('userId', userId || '')
    // await fetch('/api/story/upload', { method: 'POST', body: form })
  }

  const changeFontSize = (delta: number) => {
    if (!selectedElement) return
    const newSize = (size || 16) + delta
    updateSelectedElement({ fontSize: Math.max(8, newSize) })
    setSize(newSize)
  }

  useEffect(()=>{changeFontSize(0)},[size])

  return (
    <div className="flex p-4 w-full lg:w-250 h-screen overflow-clip">
      <div className='w-full sm:w-1/2 h-full'>
        <div
          ref={storyRef}
          className="relative shadow mx-auto border rounded w-full max-w-[360px] aspect-[3/5] overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {elements.map((el, i) => (
            <DraggableElement
              key={el.id}
              id={el.id}
              isSelected={selectedId === el.id}
              onClick={() => setSelectedId(el.id)}
              zIndex={selectedId === el.id ? 999 : i + 1}
              position={{ x: el.x || 0, y: el.y || 0 }}
              size={{ width: el.width || 100, height: el.height || 100 }}
              onDragEnd={(x, y) => updateElementPosition(el.id, x, y, setElements)}
              onResizeEnd={(w, h) => updateElementSize(el.id, w, h, setElements)}
            >
              {el.type === "image" ? (
                <img src={el.content} className="w-full h-full object-cover" />
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

        <button
          onClick={handleSubmit}
          className="bg-green-600 px-6 py-2 rounded w-full text-white"
        >
          📤 Post Story
        </button>
      </div>
      <motion.div whileTap={{ scale: 0.8 }} className='sm:hidden right-1 bottom-30 z-1001 absolute bg-gradient-to-l from-[#7726b4] to-[#c85eee] p-3 rounded-md' onClick={()=>setShow(!show)}>Add</motion.div>
      <AnimatePresence>
          {show && <motion.div
          initial={{x: -300}}
          animate={{x: 25}}
          exit={{x: -300}}
          className='top-0 left-0 z-1000 absolute bg-[#1a1e23] p-5 h-full'>
            <div className="space-y-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your story text"
                className="px-4 py-2 border rounded w-full"
              />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddText}
                className="bg-blue-600 px-4 py-1 rounded text-white"
              >
                ➕ Add Text
              </button>

              <button
                onClick={triggerImageUpload}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                📷 Add Image
              </button>

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
                
                {selectedElement && selectedElement.type !== 'image' && (
                  <div className="gap-4 grid">
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeFontSize(-1)} className="bg-gray-200 px-2 rounded">-</button>
                      <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.valueAsNumber)}
                        placeholder="Enter your story text"
                        className="px-2 py-1 border rounded w-15"
                      />
                      <span>px</span>
                      <button onClick={() => changeFontSize(1)} className="bg-gray-200 px-2 rounded">+</button>
                    </div>
                  </div>
                )}

                {selectedElement?.type === 'text' && (
                  <div className="gap-4 grid grid-cols-2">
                    <div className='w-full h-full'>
                      <p className="font-semibold text-sm">Text Color</p>
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
                      <p className="font-semibold text-sm">Background</p>
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
                  <button onClick={() => setElements(e => e.filter(el => el.id !== selectedId))}>
                    ❌ Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>}
          <motion.div
          initial={{x: -300}}
          animate={{x: 25}}
          exit={{x: -300}}
          className='hidden sm:block p-5 w-1/2 h-full'>
            <div className="space-y-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your story text"
                className="px-4 py-2 border rounded w-full"
              />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddText}
                className="bg-blue-600 px-4 py-1 rounded text-white"
              >
                ➕ Add Text
              </button>

              <button
                onClick={triggerImageUpload}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                📷 Add Image
              </button>

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
                
                {selectedElement && selectedElement.type !== 'image' && (
                  <div className="gap-4 grid">
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeFontSize(-1)} className="bg-gray-200 px-2 rounded">-</button>
                      <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.valueAsNumber)}
                        placeholder="Enter your story text"
                        className="px-2 py-1 border rounded w-15"
                      />
                      <span>px</span>
                      <button onClick={() => changeFontSize(1)} className="bg-gray-200 px-2 rounded">+</button>
                    </div>
                  </div>
                )}

                {selectedElement?.type === 'text' && (
                  <div className="gap-4 grid grid-cols-2">
                    <div className='w-full h-full'>
                      <p className="font-semibold text-sm">Text Color</p>
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
                      <p className="font-semibold text-sm">Background</p>
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
                  <button onClick={() => setElements(e => e.filter(el => el.id !== selectedId))}>
                    ❌ Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
      
    </div>
  )
}