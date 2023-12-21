import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useState, useRef, useEffect } from 'react';
import { storage, db } from '../config/firebase-config';
import { getDownloadURL, uploadBytes, ref, listAll, deleteObject } from 'firebase/storage';
import { onSnapshot, addDoc, collection, doc, getDocs, getDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import ClearIcon from '@mui/icons-material/Clear';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SelectApplication from './UserMng/SelectApplication';
import Popup from './PopUp';
import Selectmembers from './UserMng/selectmembers';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DatePicker from 'react-datepicker';

const EditTicket = ({handleClose, ticketId, userId, authorId}) => {
    //console.log('Passed data in Edit Ticket: ', ticketId, userId, authorId)
    const [loading, setLoading] = useState(true); // Added loading state
    const [data, setData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [existingApplication, setExistingApplication] = useState(null);
    const [selectedSeverity, setSelectedSeverity] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState({
        author: sessionStorage.getItem('uid'),
        subject: '',
        description: '',
        severity: '',
        type: '',
        attachments: [],
        turnaroundtime: null
      });

    useEffect(() => {
        const fetchData = async () => {
          try {
            if(!ticketId){
                console.log("Ticket ID is missing.");
                return;
            }

            const ticketRef = doc(db, 'tickets', ticketId);
            const ticketDoc = await getDoc(ticketRef);

            if (ticketDoc.exists()) {
                console.log("ticketDoc.data(): ",ticketDoc.data());
                setExistingApplication(ticketDoc.data().application);

                const appRef = doc(db, 'applications', ticketDoc.data().application);
                const appDoc = await getDoc(appRef);
          
                  if (appDoc.exists()) {
                      //console.log("Developer document for ID ", developerId, ": ", devDoc.data());
                      //setExistingApplication(appDoc.data());
                      setSelectedApplication(appDoc.data());
                      
                  } else {
                      console.log("Developer document not found for ID ", selectedApplication);
                  }

                //setSelectedDevelopers(ticketDoc.data().assignDev);

                await getDevs(ticketDoc.data().assignDev);

                setTags(ticketDoc.data().tags);
                setSelectedSeverity(ticketDoc.data().severity);
                setSelectedType(ticketDoc.data().type);
                setFiles(ticketDoc.data().attachments);

                /*// Extract filenames and URLs from download URLs
                const attachmentsData = ticketDoc.data().attachments.map((url) => {
                  const decodedURL = decodeURIComponent(url);
                  const pathSegments = decodedURL.split('/');
                  const filenameWithQuery = pathSegments[pathSegments.length - 1];
                  const filenameWithoutQuery = filenameWithQuery.split('?')[0];

                  return {
                    url: url,
                    filename: filenameWithoutQuery,
                  };
                });

                // Extract filenames from attachmentsData
                const filenames = attachmentsData.map((attachment) => attachment.filename);

                // Set the files state
                setFiles(filenames);*/

                // Fetch files from storage
                const storageRef = ref(storage, `attachments/${ticketId}`);
                const storageFiles = await listAll(storageRef);

                // Extract filenames from storageFiles
                const filenames = storageFiles.items.map((item) => item);
                console.log("filenames: ", filenames)
                // Set the files state
                setFiles(filenames);

                console.log("Files in useEffect:", files)
                console.log("Ticket data: ", ticketDoc.data())
                updateInputState(ticketDoc.data());
            } else {
              console.log("No Matching Documents.");
            }
            setLoading(false);
          } catch (error) {
            console.error("Error fetching data: ", error);
            // Handle the error condition here
            setLoading(false);
          }
        };
    
        fetchData();
        // Include dependencies in the array if needed (e.g., [ticketId])
      }, [ticketId]);
      
      const getDevs = async (devArray) => {
        const developerDocs = [];
                
                for (const developerUid of devArray) {
                  // Create a query to find the document with the matching 'uid' field
                  const q = query(collection(db, 'users'), where('uid', '==', developerUid));
                  const querySnapshot = await getDocs(q);
          
                  if (querySnapshot.docs.length > 0) {
                    // Assuming there is only one document for each 'uid'
                    const devDoc = querySnapshot.docs[0];
                    console.log("Developer document for UID ", developerUid, ": ", devDoc.data());
                    developerDocs.push(devDoc.data());
                    // Do something with the developer document
                  } else {
                    console.log("Developer document not found for UID ", developerUid);
                  }
                }        

                setDevelopers(developerDocs);
                setSelectedDevelopers(developerDocs)
                //setSelectedApplication(applicationDoc)
                console.log("Returned documents for Assigned Developers: ", selectedDevelopers);
      }

      const updateInputState = (fetchedData) => {
        // Convert nanoseconds and seconds to milliseconds
        const milliseconds = fetchedData.turnaroundtime.seconds * 1000 + Math.floor(fetchedData.turnaroundtime.nanoseconds / 1e6);

        // Create a new Date object using milliseconds
        const dateObject = new Date(milliseconds);

        setInput({
          author: sessionStorage.getItem('uid'),
          subject: fetchedData.subject, // Use the fetched data or default to an empty string
          description: fetchedData.description,
          severity: fetchedData.severity,
          type: fetchedData.type,
          attachments: fetchedData.attachments,
          turnaroundtime: dateObject
        });

        console.log('Input state updated successfully:', input, "Existing selectedApplication: ", selectedApplication, "Existing selectedDevelopers: ", selectedDevelopers);
      };
    

    const handleCancel = () => {
        handleClose();
      };

    const togglePopup = (button) => {
    setSelectedButton(button);
    setShowPopup((prevShowPopup) => !prevShowPopup);
    };


    const closePopup = (userDetail) => {
        setShowPopup(false);
        setSelectedButton(null);
        console.log('Received userDetail in EditTicket after Popup Closed: ', userDetail);

        if (Array.isArray(userDetail) && userDetail.every((user) => user.id && user.firstname && user.lastname && user.role === "Developer")) {
            console.log('Selected Team Members (Developers) in CreateTicket:', userDetail);
            setDevelopers(userDetail);
          } else if(userDetail && userDetail.id && userDetail.applicationname) {
            console.log('Selected Application in EditTicket:', userDetail);
            setSelectedApplication(userDetail);
            console.log('Stored Application:', selectedApplication);
          } else {
            console.log('None selected or invalid data format.');
          }
    };

    const tagHandler = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const newTag = e.target.value.trim();
          if (newTag !== '') {
            setTags((prevTags) => [...prevTags, newTag]);
            e.target.value = ''; // Clear the input field after adding the tag
          }
          console.log("Tags:", tags);
        }
      };
    
      const inputHandler = (e) => {
        const { name, value } = e.target;
          setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
          }));    
      };
    
      const [files, setFiles] = useState([]);
      const [errormessage, setErrorMessage] = useState('');
    
      const fileInputRef = useRef(null);
    
      const handleFileInputChange = (e) => {
        const selectedFiles = e.target.files;
        setFiles([...files, ...Array.from(selectedFiles)]);
        console.log("On File Change:", files);
      };
    
      const handleRemoveFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
        console.log("Updated Files after remove: ", files);
      };
    
      const handleRemoveApplication = () => {
        setSelectedApplication(null);
      }
    
      const handleRemoveMember = (memberToRemove) => {
        console.log("Removing...", memberToRemove)
        // Create a new array excluding the member to be removed
        const updatedMembers = developers.filter(
          (member) => member.uid !== memberToRemove.uid
        );
      
        // Update the state with the new array
        setDevelopers(updatedMembers);
      };
    
      const handleRemoveTag = (index) => {
        // Create a new array excluding the tag to be removed
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
    
        // Update the state with the new array
        setTags(updatedTags);
      };
    
    
      const submitHandler = async (e) => {
        e.preventDefault();
      
        try {
          setErrorMessage('');
          if (!selectedApplication || !input.subject || !input.description || !input.severity || !input.type) {
            console.log('Some fields are empty.');
            setErrorMessage('All fields except for tags and attachments are required to be filled.');
            console.log(errormessage);
            return;
          }
    
          // Check if turnaround date is greater than today
          if (input.turnaroundtime && new Date(input.turnaroundtime) <= new Date()) {
            setErrorMessage('Turnaround date must be greater than today.');
            return;
          } else {
            let downloadURLs = [];
      
            // Upload files to storage
            if (files.length > 0) {
              const storageRef = storage;
      
              for (const selectedFile of files) {
                const fileRef = ref(storageRef, `attachments/${ticketId}/${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);
                //console.log('File uploaded successfully!');
                //console.log('Fileref: ', fileRef);
      
                const downloadURL = await getDownloadURL(fileRef);
                downloadURLs.push(downloadURL);
                //console.log("downloadURLs: ", downloadURLs, "downloadURL", downloadURL)
              }
            }
      
            // Fetch the document
            const ticketRef = doc(db, 'tickets', ticketId);
            const ticketSnapshot = await getDoc(ticketRef);
      
            // Check if the document exists
            if (ticketSnapshot.exists()) {
                        
              const originalData = ticketSnapshot.data();
      
              // Check for changes in input fields
              let updatedData = {};
              
              if (
                selectedApplication &&
                selectedApplication.id !== originalData.application.id
              ) {
                updatedData.application = selectedApplication.id;
                console.log(
                  "selectedApplication:",
                  selectedApplication,
                  "selectedApplication.id: ",
                  selectedApplication.id,
                  "originalData.application",
                  originalData.application.id,
                  "updatedData.application",
                  updatedData.application
                );
              }
              
      
              if (input.subject !== originalData.subject) {
                updatedData.subject = input.subject;
              }
      
              const updatedDevelopers = developers.map((member) => member.uid);
              if (!arraysEqual(updatedDevelopers, originalData.assignDev)) {
                updatedData.assignDev = updatedDevelopers;
              }
      
              if (input.description !== originalData.description) {
                updatedData.description = input.description;
              }
      
              if (!arraysEqual(tags, originalData.tags)) {
                updatedData.tags = tags;
              }
      
              if (input.severity !== originalData.severity) {
                updatedData.severity = input.severity;
              }
      
              if (input.type !== originalData.type) {
                updatedData.type = input.type;
              }
      
              if (!arraysEqual(downloadURLs, originalData.attachments)) {
                updatedData.attachments = downloadURLs;
                console.log("downloadURLs", downloadURLs);
              }

              console.log("Updated data:", updatedData, "Original data: ", originalData);
      
              // Perform the update only if there are changes
              if (Object.keys(updatedData).length > 0) {
                await updateDoc(ticketRef, updatedData);

                // Delete files not included in the updated files array
                const filesToDelete = originalData.attachments.filter(originalFile => {
                  const originalFilePath = originalFile.split('?')[0]; // Extracting the file path without the access token
                  return !downloadURLs.some(updatedFile => updatedFile.startsWith(originalFilePath));
                });
                console.log("File to delete: ", filesToDelete)
                for (const fileToDelete of filesToDelete) {
                  const fileRefToDelete = ref(storage, fileToDelete);
                  await deleteObject(fileRefToDelete);
                  console.log('File deleted successfully:', fileToDelete);
                }
              }
      
              /*setInput({
                author: sessionStorage.getItem('uid'),
                subject: '',
                description: '',
                severity: '',
                type: '',
                status: '',
                attachments: [],
              });
      
              setFiles([]);
              setSelectedApplication(null);
              setSelectedDevelopers([]);
              setTags([]);
              document.querySelectorAll('input[type="radio"]').forEach((radio) => {
                radio.checked = false;
              });*/
      
              console.log('Ticket Updated Successfully!');
              setErrorMessage('Ticket Updated Successfully!');
            } else {
              console.log('No Matching Documents.');
            }
          }
        } catch (error) {
          console.error('Update error:', error);
          setErrorMessage(error.message);
          console.log(errormessage);
        }
      };
      
      const deleteFolderContents = async (folderRef) => {
        const files = await listAll(folderRef);
        const deleteFilePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deleteFilePromises);
      };
      
      const deleteHandler = async (e) => {
        console.log("Delete Handler is called.");
      
        // Corrected: invoke `ref` on the storage instance
        const folderRef = ref(storage, `attachments/${ticketId}`);
      
        // Delete all files within the folder
        await deleteFolderContents(folderRef);
      
        // Corrected: delete the document using the `deleteDoc` function
        await deleteDoc(doc(db, 'tickets', ticketId));
      
        console.log("Ticket and storage deleted.", ticketId, folderRef);
        handleCancel();
        window.location.reload();
      };
            
      // Helper function to check if two arrays are equal
      function arraysEqual(arr1, arr2) {
        return (
          arr1.length === arr2.length &&
          arr1.every((value) => arr2.includes(value)) &&
          arr2.every((value) => arr1.includes(value))
        );
      }

      const dateHandler = (date) => {
        setInput((prevInput) => ({
          ...prevInput,
          turnaroundtime: date.toLocaleDateString(),
        }));
      };
      
    
      function isUserHasPermission(userId, authorId) {
        console.log("Role: ", sessionStorage.getItem('role'), "UserId: ", userId, "AuthorId: ",authorId)
        if (sessionStorage.getItem('role') === 'Admin' || userId === authorId) {
          console.log("Has permission.")
          return true;
        } else {
          console.log("No permission.")
          return false;
        }
      }

      function isDeveloper() {
        if (sessionStorage.getItem('role') === 'Developer') {
          console.log("Is Developer.")
          return true;
        } else {
          console.log("No permission.")
          return false;
        }
      }      

  return (
    <div className='edit-ticket'>
        <div className='typanan'>
            <div id='new-line'>
                <label>Application: </label>
                <button 
                  id='add-icon'
                  style={{ display: isUserHasPermission(userId, authorId) ? 'block' : 'none' }}
                  onClick={() => togglePopup('application')}>
                    <AppRegistrationIcon/>
                </button>
                <label id='selected'>
                    {selectedApplication ? selectedApplication.applicationname : 'No Application Selected'}
                    {selectedApplication && (
                    <ClearIcon
                    className='clear-icon' 
                    style={{ display: isUserHasPermission(userId, authorId) ? '' : 'none' }}
                    onClick={() => handleRemoveApplication(selectedApplication)}
                    />
                    )}
                </label>
            </div>
        
            <div id='new-line'>
                <label>Subject: </label>
                <input
                    type="text" 
                    name="subject" 
                    disabled={!isUserHasPermission(userId, authorId)}
                    value = {input.subject}
                    onChange={(e) => inputHandler(e)}
                />
            </div>
        
            <div id='new-line'>
                <label>Assigned Developer: </label>
                {selectedApplication && 
                (<button 
                  id='add-icon' 
                  style={{ display: isUserHasPermission(userId, authorId) ? '' : 'none' }}
                  onClick={() => togglePopup('members')}>
                    <PersonAddAlt1Icon/>
                </button>)}
                <div id='selectedMembers'>
                    {developers.map((member) => (
                        <div key={member.id} id='list'>
                        <label>
                            {member.lastname + ', ' + member.firstname}
                            <ClearIcon
                            className='clear-icon'
                            style={{ display: isUserHasPermission(userId, authorId) ? '' : 'none' }}
                            onClick={() => handleRemoveMember(member)}
                            />
                        </label>
                        </div>
                    ))}
                </div>
            </div>

            <div id='new-line'>
            <label>Description/Resolution: </label>
            </div>
            <textarea 
                type="text"
                name='description'
                disabled={!(isUserHasPermission(userId, authorId) || isDeveloper())}
                value = {input.description}
                onChange={(e) => inputHandler(e)}
                cols="30" 
                rows="10">
            </textarea>
        
            <div id='new-line-tags'>
                <label>Tags: </label>
                <input
                    type="text"
                    name="tags"
                    style={{ display: isUserHasPermission(userId, authorId) ? '' : 'none' }}
                    placeholder='Input tag then press Enter...'
                    onKeyUp={(e) => tagHandler(e)}
                />
                <div id='tagslist'>
                    {tags.map((tag, index) => (
                        <div key={index} id='tags'>
                        <label>
                            {tag}
                            <ClearIcon
                            className='clear-icon'
                            style={{ display: isUserHasPermission(userId, authorId) ? '' : 'none' }}
                            onClick={() => handleRemoveTag(index)}
                            />
                        </label>
                        </div>
                    ))}
                </div>
            </div>
        
            <div id='new-line-radios'>
              <label>Severity/Priority: </label>
              <input
                type="radio"
                name="severity"
                value="Critical"
                onChange={(e) => inputHandler(e, 'severity')}
                checked={selectedSeverity === 'Critical'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Critical</label>

              <input
                type="radio"
                name="severity"
                value="High"
                onChange={(e) => inputHandler(e, 'severity')}
                checked={selectedSeverity === 'High'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>High</label>

              <input
                type="radio"
                name="severity"
                value="Medium"
                onChange={(e) => inputHandler(e, 'severity')}
                checked={selectedSeverity === 'Medium'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Medium</label>

              <input
                type="radio"
                name="severity"
                value="Low"
                onChange={(e) => inputHandler(e, 'severity')}
                checked={selectedSeverity === 'Low'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Low</label>
            </div>

        
            <div id='new-line-radios'>
              <label>Type: </label>
              <input
                type="radio"
                name="type"
                value="Functional"
                onChange={(e) => inputHandler(e, 'type')}
                checked={selectedType === 'Functional'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Functional</label>

              <input
                type="radio"
                name="type"
                value="Performance"
                onChange={(e) => inputHandler(e, 'type')}
                checked={selectedType === 'Performance'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Performance</label>

              <input
                type="radio"
                name="type"
                value="Usability"
                onChange={(e) => inputHandler(e, 'type')}
                checked={selectedType === 'Usability'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Usability</label>

              <input
                type="radio"
                name="type"
                value="Compatibility"
                onChange={(e) => inputHandler(e, 'type')}
                checked={selectedType === 'Compatibility'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Compatibility</label>

              <input
                type="radio"
                name="type"
                value="Security"
                onChange={(e) => inputHandler(e, 'type')}
                checked={selectedType === 'Security'}
                disabled={!isUserHasPermission(userId, authorId)}
              />
              <label>Security</label>
            </div>


            <div className='typanan'>
              <div id='new-line'>
                  <label>Turnaround Date:</label>
                  <DatePicker
                  dateFormat='yyyy/MM/dd'
                  placeholderText='Select a Date'
                  selected={input.turnaroundtime}
                  disabled={!isUserHasPermission(userId, authorId)}
                  onChange={(date) => dateHandler(date)}
                  minDate={new Date()} // Set the minimum date to the current date
                  />
              </div>
            </div>  
          
            <div id='selectedfiles'>
            <input
                type="file"
                accept="image/*, .pdf, .doc, .docx"  // Define the file types you want to allow
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
            />

            <button
                className='addAtt'
                onClick={() => fileInputRef.current.click()} // Trigger file input click on button click
            >
                <AttachFileIcon />
                <div id='addAtt'> Add Attachments </div>
            </button>
                {files.length > 0 && (
                <div>
                    <p>Selected Files:</p>
                    <ul id='selectedfiles'>
                    {files.map((file, index) => (
                        <li key={index}>
                        {file.name}
                        <ClearIcon
                            className='clear-icon'
                            onClick={() => handleRemoveFile(index)}
                        />
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>

            <div className='error-message'>
            {errormessage}
            </div>
        </div>

        <div className='formbuttons'>
            <button className='delete-ticket' id='text'>
              <div id='text' onClick={deleteHandler}> Delete Ticket </div>
            </button>
            <button className='save-changes' id='text'>
              <div id='text' onClick={submitHandler}> Save Changes </div>
            </button>
            <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Cancel Edit </div>
            </button>
        </div>

        <Popup show={showPopup} handleClose={closePopup}>
          {selectedButton === 'application' && <SelectApplication handleClose={closePopup}/>}
          {selectedButton === 'members' && <Selectmembers handleClose={closePopup}/>}
        </Popup> 
    </div>
  )
}

export default EditTicket
