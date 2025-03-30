import { NextResponse } from 'next/server';
import {  GENDER, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';


// User data for admins
const adminUserData = [
  {
    name: 'John Smith',
    email: 'john.smith@languagelibrary.com',
    gender: GENDER.MALE,
    bio: 'Head librarian with 15 years of experience in language education resources.',
    profilePicUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@languagelibrary.com',
    gender: GENDER.FEMALE,
    bio: 'English language department head and curriculum specialist.',
    profilePicUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'David Chen',
    email: 'david.chen@languagelibrary.com',
    gender: GENDER.MALE,
    bio: 'Digital resources manager specializing in linguistics and language teaching.',
    profilePicUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@languagelibrary.com',
    gender: GENDER.FEMALE,
    bio: 'Academic coordinator for TESOL programs and resources.',
    profilePicUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@languagelibrary.com',
    gender: GENDER.MALE,
    bio: 'Technical language resource specialist with focus on educational technology.',
    profilePicUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

export async function POST() {
  try {
    // Check if admin users already exist to avoid duplicates
    const existingAdminCount = await prisma.user.count({
      where: {
        role: UserRole.ADMIN
      }
    });
    
    if (existingAdminCount > 0) {
      return NextResponse.json({
        success: false,
        message: 'Admin users already exist in the database',
        count: existingAdminCount
      });
    }
    
    // Create admin users
    const createdAdmins = [];
    
    for (const userData of adminUserData) {
      // Hash password - using a standard password for all admins
      const hashedPassword = await hash('Admin123!', 10);
      
      // Create the user with admin role
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          gender: userData.gender,
          role: UserRole.ADMIN,
          password: hashedPassword,
          profile: {
            create: {
              bio: userData.bio,
              phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              isVerified: true,
              birthdate: new Date(1970 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              title: `${userData.gender === GENDER.MALE ? 'Mr.' : 'Ms.'} ${userData.name}`,
              website: JSON.stringify({
                personal: `https://www.${userData.name.toLowerCase().replace(' ', '')}.edu`,
                linkedin: `https://www.linkedin.com/in/${userData.name.toLowerCase().replace(' ', '-')}`
              }),
              profilePictures: {
                create: {
                  url: userData.profilePicUrl,
                  publicId: `admin-${userData.name.toLowerCase().replace(' ', '-')}`,
                  assetId: `asset-admin-${userData.name.toLowerCase().replace(' ', '-')}`,
                  width: 400,
                  height: 400,
                  format: 'jpg',
                  secureUrl: userData.profilePicUrl,
                  publicUrl: userData.profilePicUrl,
                  assetFolder: 'profiles',
                  displayName: `${userData.name}'s Profile Picture`,
                  tags: ['profile', 'admin', 'user'],
                  hashBlur: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.'
                }
              }
            }
          }
        }
      });
      
      createdAdmins.push(user);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully created admin users',
      data: {
        count: createdAdmins.length,
        admins: createdAdmins.map(admin => ({
          id: admin.id,
          name: admin.name,
          email: admin.email
        }))
      }
    });
    
  } catch (error) {
    console.error('Error creating admin users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create admin users',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
