'use server';

import { AddImageParams, UpdateImageParams } from '@/types';
import { handleError } from '@/lib/utils';
import { connectToDatabase } from '@/lib/database/mongoose';
import { revalidatePath } from 'next/cache';
import Image from '@/lib/database/models/image.model';
import User from '@/lib/database/models/user.model';

export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    if (!author) throw new Error('User not found');

    const newImage = await Image.create({ ...image, author: author._id });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    revalidatePath(path);

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    revalidatePath(path);

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();

    revalidatePath(path);

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}
