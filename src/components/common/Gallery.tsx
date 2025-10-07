import React, { useState } from 'react';
import { Box, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface GalleryProps {
    images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const modalStyle = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', md: 800 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 1,
        textAlign: 'center',
        outline: 'none',
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={handleOpen}>
                <Box
                    component="img"
                    src={mainImage}
                    alt="Główny widok produktu"
                    sx={{ maxWidth: '100%', maxHeight: 450, height: 'auto', objectFit: 'contain' }}
                />
            </Paper>
            <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2, pb: 1, gap: 1 }}>
                {images.map((image, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Miniaturka ${index + 1}`}
                        onClick={() => setMainImage(image)}
                        sx={{
                            width: 70,
                            height: 70,
                            minWidth: 70,
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: image === mainImage ? '2px solid' : '1px solid #ccc',
                            borderColor: image === mainImage ? 'primary.main' : '#ccc',
                            borderRadius: 1,
                            transition: 'all 0.2s',
                            '&:hover': {
                                opacity: 0.8,
                            }
                        }}
                    />
                ))}
            </Box>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
                <Box sx={modalStyle}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={mainImage}
                        alt="Powiększony widok produktu"
                        sx={{ maxWidth: '100%', maxHeight: '80vh', height: 'auto', objectFit: 'contain' }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default Gallery;
