import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, spacing, shadows, borderRadius, typography, transitions, Button, Input } from '../../styles/GlobalStyles';
import { Tag } from '../../types';
import ApiService from '../../services/api';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onTagsChange: (tags: Tag[]) => void;
  existingTags: Tag[];
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${shadows.xl};
  animation: fadeIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.textPrimary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${typography.fontSize.xl};
  cursor: pointer;
  color: ${colors.textMuted};
  
  &:hover {
    color: ${colors.textPrimary};
  }
`;

const TagForm = styled.form`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.xl};
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.md};
  cursor: pointer;
`;

const TagsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.md};
  background: ${colors.white};
  
  &:hover {
    background: ${colors.hover};
  }
`;

const TagPreview = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const TagColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: ${borderRadius.full};
  background: ${props => props.color};
`;

const TagName = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textPrimary};
`;

const TagActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.sm};
  color: ${colors.textMuted};
  
  &:hover {
    background: ${colors.hover};
    color: ${colors.textPrimary};
  }
`;

const TagManager: React.FC<TagManagerProps> = ({ 
  isOpen, 
  onClose, 
  onTagsChange, 
  existingTags 
}) => {
  const [tags, setTags] = useState<Tag[]>(existingTags);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#667eea');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTags(existingTags);
  }, [existingTags]);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setLoading(true);
      const newTag = await ApiService.createTag({
        name: newTagName.trim(),
        color: newTagColor
      });
      
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      onTagsChange(updatedTags);
      setNewTagName('');
      setNewTagColor('#667eea');
    } catch (error) {
      console.error('Erreur lors de la création de l\'étiquette:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) return;

    try {
      await ApiService.deleteTag(tagId);
      const updatedTags = tags.filter(tag => tag.id !== tagId);
      setTags(updatedTags);
      onTagsChange(updatedTags);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étiquette:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Gérer les étiquettes</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <TagForm onSubmit={handleCreateTag}>
          <Input
            type="text"
            placeholder="Nom de l'étiquette"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            style={{ flex: 1 }}
          />
          <ColorPicker
            type="color"
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
          />
          <Button type="submit" disabled={loading || !newTagName.trim()}>
            Ajouter
          </Button>
        </TagForm>

        <TagsList>
          {tags.map((tag) => (
            <TagItem key={tag.id}>
              <TagPreview color={tag.color}>
                <TagColor color={tag.color} />
                <TagName>{tag.name}</TagName>
              </TagPreview>
              <TagActions>
                <ActionButton 
                  onClick={() => tag.id && handleDeleteTag(tag.id)}
                  title="Supprimer"
                >
                  🗑️
                </ActionButton>
              </TagActions>
            </TagItem>
          ))}
          {tags.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: colors.textMuted, 
              padding: spacing.xl 
            }}>
              Aucune étiquette créée
            </div>
          )}
        </TagsList>
      </Modal>
    </Overlay>
  );
};

export default TagManager;