import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import matplotlib.pyplot as plt
import time
from pathlib import Path
import logging
from tqdm import tqdm
import numpy as np
import seaborn as sns

# <--- NEW: Additional imports for improvements
from torch.optim.lr_scheduler import ReduceLROnPlateau
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix

# =====================
# Logging setup
# =====================
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# =====================
# 1. Device setup
# =====================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# =====================
# 2. Data transforms with augmentation
# =====================
# This already includes robust augmentations like RandomErasing as suggested.
train_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(0.3, 0.3, 0.3, 0.1),
    transforms.ToTensor(),  # Convert to Tensor FIRST
    transforms.RandomApply([transforms.RandomErasing(p=0.5)], p=0.3), # Now apply Tensor-based transforms
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # Normalize last
])

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# =====================
# 3. Improved CNN model with batch normalization (Your original class, kept for reference)
# =====================
class ImprovedCNN(nn.Module):
    def __init__(self, num_classes, dropout_rate=0.5):
        super(ImprovedCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn4 = nn.BatchNorm2d(256)
        self.fc1 = nn.Linear(256 * 14 * 14, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, num_classes)
        self.relu = nn.ReLU(inplace=True)
        self.dropout = nn.Dropout(dropout_rate)
        self._initialize_weights()

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)

    def forward(self, x):
        x = self.pool(self.relu(self.bn1(self.conv1(x))))
        x = self.pool(self.relu(self.bn2(self.conv2(x))))
        x = self.pool(self.relu(self.bn3(self.conv3(x))))
        x = self.pool(self.relu(self.bn4(self.conv4(x))))
        x = x.view(x.size(0), -1)
        x = self.dropout(self.relu(self.fc1(x)))
        x = self.dropout(self.relu(self.fc2(x)))
        x = self.fc3(x)
        return x

# =====================
# 4. Helper Functions
# =====================
def train_epoch(model, train_loader, criterion, optimizer, device):
    """Train for one epoch"""
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    
    with tqdm(train_loader, desc="Training", leave=False) as pbar:
        for images, labels in pbar:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            pbar.set_postfix({'Loss': f'{loss.item():.4f}', 'Acc': f'{100.*correct/total:.2f}%'})
    
    return running_loss / len(train_loader), correct / total

def validate_epoch(model, val_loader, criterion, device):
    """Validate for one epoch"""
    model.eval()
    running_loss, correct, total = 0.0, 0, 0
    
    with torch.no_grad():
        with tqdm(val_loader, desc="Validation", leave=False) as pbar:
            for images, labels in pbar:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                running_loss += loss.item()
                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                
                pbar.set_postfix({'Loss': f'{loss.item():.4f}', 'Acc': f'{100.*correct/total:.2f}%'})
    
    return running_loss / len(val_loader), correct / total

def plot_training_history(train_acc, val_acc, train_loss, val_loss, save_path):
    """Plot and save training history"""
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(train_acc, label='Training Accuracy', color='blue')
    plt.plot(val_acc, label='Validation Accuracy', color='red')
    plt.xlabel('Epoch'); plt.ylabel('Accuracy'); plt.title('Training and Validation Accuracy')
    plt.legend(); plt.grid(True, alpha=0.3)
    
    plt.subplot(1, 2, 2)
    plt.plot(train_loss, label='Training Loss', color='blue')
    plt.plot(val_loss, label='Validation Loss', color='red')
    plt.xlabel('Epoch'); plt.ylabel('Loss'); plt.title('Training and Validation Loss')
    plt.legend(); plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()

def save_checkpoint(model, optimizer, epoch, train_acc, val_acc, path):
    """Save model checkpoint"""
    torch.save({
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'train_acc': train_acc,
        'val_acc': val_acc,
    }, path)

# <--- NEW: Function for detailed evaluation and reporting
def evaluate_and_report(model, val_loader, device, class_names, reports_dir):
    """Generate and save classification report and confusion matrix"""
    model.eval()
    all_preds, all_labels = [], []
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            preds = outputs.argmax(1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    # Classification Report
    report = classification_report(all_labels, all_preds, target_names=class_names, digits=4)
    logger.info("Classification Report:\n" + report)
    with open(reports_dir / 'classification_report.txt', 'w') as f:
        f.write(report)

    # Confusion Matrix
    cm = confusion_matrix(all_labels, all_preds)
    plt.figure(figsize=(15, 12))
    sns.heatmap(cm, annot=True, fmt="d", cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.title('Confusion Matrix')
    plt.savefig(reports_dir / 'confusion_matrix.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    # =====================
    # Configuration
    # =====================
    base_dir = Path(__file__).parent.parent
    config = {
    'train_dir': base_dir / 'data' / 'train',
    'val_dir': base_dir / 'data' / 'valid',
    'batch_size': 64,            # 6GB can handle 64 easily
    'num_epochs': 40,            # longer training = better fine-tuning
    'learning_rate': 3e-4,       # stable base LR
    'weight_decay': 1e-5,        # mild regularization
    'patience': 8,               # let it breathe longer before stopping
    'save_dir': base_dir / 'models',
    'reports_dir': base_dir / 'reports',
    'fine_tune_after_epoch': 5,  # start unfreezing after 5 epochs
    'fine_tune_lr': 1e-5         # super-low LR for pretrained layers
}

    config['save_dir'].mkdir(parents=True, exist_ok=True)
    config['reports_dir'].mkdir(parents=True, exist_ok=True)
    
    # =====================
    # Dataset loading
    # =====================
    try:
        train_dataset = datasets.ImageFolder(config['train_dir'], transform=train_transforms)
        val_dataset = datasets.ImageFolder(config['val_dir'], transform=val_transforms)
        logger.info(f"Training samples: {len(train_dataset)}, Validation samples: {len(val_dataset)}")
        logger.info(f"Classes: {train_dataset.classes}")
    except Exception as e:
        logger.error(f"Error loading datasets: {e}. Check paths: {config['train_dir']}, {config['val_dir']}")
        return
    
    train_loader = DataLoader(train_dataset, batch_size=config['batch_size'], shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=config['batch_size'], shuffle=False, num_workers=4, pin_memory=True)
    
    # =====================
    # Model setup (Transfer Learning)
    # =====================
    num_classes = len(train_dataset.classes)
    model = models.mobilenet_v2(weights='IMAGENET1K_V1')
    for param in model.parameters():
        param.requires_grad = False
    
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model = model.to(device)
    
    # <--- NEW: Class weighting for imbalanced datasets
    class_weights = compute_class_weight(
        'balanced',
        classes=np.arange(num_classes),
        y=[label for _, label in train_dataset.samples]
    )
    weights = torch.tensor(class_weights, dtype=torch.float).to(device)
    logger.info(f"Using class weights: {weights}")
    
    criterion = nn.CrossEntropyLoss(weight=weights, label_smoothing=0.1)
    
    optimizer = optim.AdamW(
        model.classifier.parameters(),
        lr=config['learning_rate'],
        weight_decay=config['weight_decay']
    )

    # <--- NEW: Learning Rate Scheduler
    scheduler = ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=2)

    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    logger.info(f"Total params: {total_params:,} | Initial trainable params: {trainable_params:,}")
    
    # =====================
    # Training loop
    # =====================
    history = {'train_loss': [], 'val_loss': [], 'train_acc': [], 'val_acc': []}
    best_val_acc = 0.0
    patience_counter = 0
    start_time = time.time()
    logger.info("Starting training...")
    
    for epoch in range(config['num_epochs']):
        # <--- NEW: Fine-tuning logic
        if epoch == config['fine_tune_after_epoch']:
            logger.info("="*20)
            logger.info(f"Epoch {epoch+1}: Unfreezing last 4 blocks for fine-tuning.")
            logger.info("="*20)
            
            # Unfreeze the last few layers
            for param in model.features[-4:].parameters():
                param.requires_grad = True

            # Re-initialize optimizer with all trainable parameters
            optimizer = optim.AdamW(
                filter(lambda p: p.requires_grad, model.parameters()),
                lr=config['fine_tune_lr'],
                weight_decay=config['weight_decay']
            )
            # Reset scheduler with the new optimizer
            scheduler = ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=2)
            
            trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
            logger.info(f"New number of trainable parameters: {trainable_params:,}")

        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = validate_epoch(model, val_loader, criterion, device)
        
        history['train_loss'].append(train_loss); history['val_loss'].append(val_loss)
        history['train_acc'].append(train_acc); history['val_acc'].append(val_acc)
        
        logger.info(
            f"Epoch [{epoch+1}/{config['num_epochs']}] | "
            f"Train Loss: {train_loss:.4f}, Acc: {train_acc*100:.2f}% | "
            f"Val Loss: {val_loss:.4f}, Acc: {val_acc*100:.2f}%"
        )
        
        # <--- NEW: Scheduler Step
        scheduler.step(val_acc)
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            patience_counter = 0
            save_checkpoint(model, optimizer, epoch, train_acc, val_acc, config['save_dir'] / 'best_model.pth')
            logger.info(f"New best validation accuracy: {val_acc*100:.2f}%. Checkpoint saved.")
        else:
            patience_counter += 1
        
        if patience_counter >= config['patience']:
            logger.info(f"Early stopping at epoch {epoch+1}")
            break
            
    # =====================
    # Save final results
    # =====================
    total_time = time.time() - start_time
    logger.info(f"Training completed in {total_time/60:.2f} minutes")
    logger.info(f"Best validation accuracy: {best_val_acc*100:.2f}%")
    
    torch.save(model.state_dict(), config['save_dir'] / 'final_model.pth')
    plot_training_history(history['train_acc'], history['val_acc'], history['train_loss'], history['val_loss'], config['reports_dir'] / 'training_history.png')
    
    # =====================
    # <--- NEW: Final Evaluation and Reporting on the BEST model
    # =====================
    logger.info("Loading best model for final evaluation...")
    checkpoint = torch.load(config['save_dir'] / 'best_model.pth')
    model.load_state_dict(checkpoint['model_state_dict'])
    evaluate_and_report(model, val_loader, device, train_dataset.classes, config['reports_dir'])
    
    # =====================
    # <--- NEW: Export for Deployment (TorchScript)
    # =====================
    logger.info("Exporting the best model to TorchScript for deployment...")
    model.eval()
    model_cpu = model.to('cpu')
    scripted_model = torch.jit.script(model_cpu)
    scripted_model.save(config['save_dir'] / 'plant_disease_model.pt')
    logger.info(f"Model saved to {config['save_dir'] / 'plant_disease_model.pt'}")

    logger.info("Training pipeline completed successfully!")

if __name__ == "__main__":
    main()