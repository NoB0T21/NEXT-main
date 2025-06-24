import { files } from '@/Types'
import FileLogo from '@/components/FileLogo'
import { getFileSize } from '@/utils/utils'
import FileDropdown from './fileDropdown'

const FileCard = ({file,types,extrnsion} : {file:files, types: string,extrnsion:string}) => {
  const fileSize = getFileSize(file.fileSize)
  
  return (
    <div className='flex cursor-pointer bg-[#0000002c] flex-col gap-6 rounded-md p-5'>
      <div className=' flex justify-between'>
          {types==='image'?<img src={file.imageURL} alt='prev' className='w-16 h-16 object-cover rounded-full' />:<FileLogo type={extrnsion} extension={types}/>}
          <div className='flex flex-col items-center justify-between h-full text-sm font-light'>
              <FileDropdown file={file}/>
              <div>{fileSize}</div>
          </div>
        </div>
          <div className='w-full flex flex-col gap-1 text-sm font-medium text-clip'>
            <p className=' truncate'>{file.originalname}</p>
            <p>{file.createdAt.split('T')[0]}</p>
        </div>
    </div>
  )
}

export default FileCard
